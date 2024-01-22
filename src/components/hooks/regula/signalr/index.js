import request from 'ut-browser-request';
import EventEmitter from 'events';

class SignalRError extends Error {
    constructor(code, message) {
        super(message);
        this.name = 'SignalRError';
        this.code = code;
    }

    static from(code, error) {
        const _error = error;
        _error.code = code;
        return _error;
    }
}
class Client extends EventEmitter {
    constructor(url2, hubs) {
        super();
        this.url = url2;
        this.subscribedHubs = [];
        this.qs = {};
        this.headers = {};
        this.requestTimeout = 5e3;
        this.reconnectDelayTime = 5e3;
        this.callTimeout = 5e3;
        this.connection = {
            state: 'Disconnected',
            hub: new Hub(this),
            lastMessageAt: (/* @__PURE__ */ new Date()).getTime()
        };
        this._invocationId = 0;
        this._callTimeout = 0;
        this.bound = false;
        this.keepAlive = true;
        this.keepAliveTimeout = 5e3;
        this.beatInterval = 5e3;
        this.beatTimer = null;
        this.reconnectCount = 0;
        this.reconnectTimer = null;
        if (hubs && hubs.length > 0) {
            this.subscribedHubs = hubs.map((hubName) => ({
                name: hubName.toLocaleLowerCase()
            }));
        }
    }

    _receiveMessage(body) {
        this._markLastMessage();
        if (body.type === 'message' && typeof body.data === 'string' && body.data !== '{}') {
            const data = JSON.parse(body.data);
            if (data.M) {
                data.M.forEach((message) => {
                    const hubName = message.H.toLowerCase();
                    const handler = this.connection.hub.handlers[hubName];
                    if (handler) {
                        const methodName = message.M.toLowerCase();
                        const method = handler[methodName];
                        if (method) {
                            method.apply(this, message.A);
                        }
                    }
                });
            } else if (data.I) {
                this.connection.hub._handleCallback(+data.I, data.E, data.R);
            }
        }
    }

    _sendMessage(hub, method, args) {
        const payload = JSON.stringify({
            H: hub,
            M: method,
            A: args,
            I: this._invocationId
        });
        ++this._invocationId;
        if (this.websocket && this.websocket.readyState === this.websocket.OPEN) {
            this.websocket.send(payload);
        }
    }

    _createRequestQuery(qs = {}) {
        const query = new URLSearchParams({
            ...this.qs,
            clientProtocol: '1.5',
            transport: 'webSockets',
            connectionToken: this.connection.token,
            connectionData: JSON.stringify(this.subscribedHubs),
            ...qs
        }).toString();
        return query;
    }

    _makeRequestOptions(path) {
        const parsedUrl = new URL(`${this.url}${path}`);
        const options = {
            url: parsedUrl.href,
            headers: this.headers || {},
            timeout: this.requestTimeout || 5e3
        };
        return options;
    }

    _negotiate() {
        return new Promise((resolve, reject) => {
            const query = new URLSearchParams({
                ...this.qs,
                connectionData: JSON.stringify(this.subscribedHubs),
                clientProtocol: '1.5'
            }).toString();
            const negotiateRequestOptions = this._makeRequestOptions(
        `/negotiate?${query}`
            );
            this.request.get(negotiateRequestOptions, (err, res, body) => {
                if (err) {
                    if (err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT') {
                        reject(
                            new SignalRError(
                                'ERR_NEGOTIATE',
                `Timeout of ${this.requestTimeout}ms exceeded.`
                            )
                        );
                    }

                    reject(SignalRError.from('ERR_NEGOTIATE', err));
                }
                try {
                    if (Number(res.statusCode) === 200) {
                        const protocol = JSON.parse(body);
                        if (!protocol.TryWebSockets) {
                            reject(
                                new SignalRError(
                                    'UNSUPPORTED_WEBSOCKET',
                                    'Websocket is not supported'
                                )
                            );
                        }
                        resolve(protocol);
                    } else if (Number(res.statusCode) === 401 || Number(res.statusCode) === 302) {
                        reject(
                            new SignalRError(
                                'UNAUTHORIZED',
                `Server responded with status code ${res.statusCode}, stopping the connection.`
                            )
                        );
                    } else {
                        reject(
                            new SignalRError(
                                'ERR_NEGOTIATE',
                `Server responded with status code ${res.statusCode}.`
                            )
                        );
                    }
                } catch {
                    reject(
                        new SignalRError(
                            'ERR_NEGOTIATE',
                            'Error parsing negotiate response.'
                        )
                    );
                }
            });
        });
    }

    _connect() {
        const url2 = this.url.replace(/^http/, 'ws');
        const query = this._createRequestQuery({ tid: 10 });
        const ws = new WebSocket(`${url2}/connect?${query}`);
        ws.onopen = () => {
            this._invocationId = 0;
            this._callTimeout = 0;
            this._start().then(() => {
                this.reconnectCount = 0;
                this.emit('connected');
                this.connection.state = 'Connected';
                this._markLastMessage();
                // eslint-disable-next-line promise/always-return
                if (this.keepAlive) { this._beat(); }
            }).catch((error) => {
                this.connection.state = 'Disconnected';
                this._error(error);
            });
        };
        ws.onerror = (event) => {
            this._error(new SignalRError('ERR_SOCKET', event.message));
        };
        ws.onmessage = (message) => {
            this._receiveMessage(message);
        };
        ws.onclose = () => {
            this._callTimeout = 1e3;
            this.connection.state = 'Disconnected';
            this.emit('disconnected', 'failed');
            this._reconnect();
        };
        // ws.on("unexpected-response", (_, response) => {
        //   this.connection.state = "Disconnected";
        //   if (response && response.statusCode === 401) {
        //     this._error(
        //       new SignalRError(
        //         "UNAUTHORIZED",
        //         `Server responded with status code ${response.statusCode}, stopping the connection.`
        //       )
        //     );
        //     this._clearBeatTimer();
        //     this._close();
        //     this.emit("disconnected", "unauthorized");
        //   } else {
        //     new SignalRError(
        //       "ERR_CONNECT",
        //       "Connect failed with unexpected response."
        //     );
        //   }
        // });
        this.websocket = ws;
    }

    _reconnect(restart = false) {
        if (this.reconnectTimer || this.connection.state === 'Reconnecting') {
            return;
        }
        this._clearBeatTimer();
        this._close();
        this.reconnectTimer = setTimeout(() => {
            ++this.reconnectCount;
            this.connection.state = 'Reconnecting';
            this.emit('reconnecting', this.reconnectCount);
            restart ? this.start() : this._connect();
            this.reconnectTimer = null;
        }, this.reconnectDelayTime || 5e3);
    }

    _clearReconnectTimer() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
    }

    _beat() {
        const timeElapsed = (/* @__PURE__ */ new Date()).getTime() - this.connection.lastMessageAt;
        if (timeElapsed > this.keepAliveTimeout) {
            this.connection.state = 'Disconnected';
            this._error(
                new SignalRError(
                    'CONNECTION_LOST',
                    'Keep alive timed out. Connection has been lost.'
                )
            );
        } else {
            this.beatTimer = setTimeout(() => {
                this._beat();
            }, this.beatInterval);
        }
    }

    _clearBeatTimer() {
        if (this.beatTimer) {
            clearTimeout(this.beatTimer);
            this.beatTimer = null;
        }
    }

    _markLastMessage() {
        this.connection.lastMessageAt = (/* @__PURE__ */ new Date()).getTime();
    }

    _start() {
        return new Promise((resolve, reject) => {
            const query = this._createRequestQuery();
            const startRequestOptions = this._makeRequestOptions(`/start?${query}`);
            this.request.get(startRequestOptions, (err, res, body) => {
                if (err) {
                    if (err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT') {
                        reject(
                            new SignalRError(
                                'ERR_START',
                `Timeout of ${this.requestTimeout}ms exceeded.`
                            )
                        );
                    }
                    reject(SignalRError.from('ERR_START', err));
                }
                if (Number(res.statusCode) === 200) {
                    resolve();
                } else if (Number(res.statusCode) === 401 || Number(res.statusCode) === 302) {
                    reject(
                        new SignalRError(
                            'UNAUTHORIZED',
              `Server responded with status code ${res.statusCode}, stopping the connection.`
                        )
                    );
                } else {
                    reject(
                        new SignalRError(
                            'ERR_START',
              `Server responded with status code ${res.statusCode}.`
                        )
                    );
                }
            });
        });
    }

    _abort() {
        return new Promise((resolve, reject) => {
            const query = this._createRequestQuery();
            const abortRequestOptions = this._makeRequestOptions(`/abort?${query}`);
            abortRequestOptions.method = 'POST';
            this.request(abortRequestOptions, (err, res, body) => {
                if (err) {
                    reject(SignalRError.from('ERR_ABORT', err));
                }
                resolve();
            });
        });
    }

    _error(error) {
        this.emit('error', error);
        const code = error.code;
        if (code === 'ERR_NEGOTIATE' || code === 'ERR_CONNECT') {
            this._reconnect(true);
        }
        if (code === 'ERR_START' || code === 'CONNECTION_LOST') {
            this._reconnect();
        }
    }

    _close() {
        if (this.websocket) {
            this.websocket.onclose = null;
            this.websocket.onmessage = null;
            this.websocket.onerror = null;
            this.websocket.close();
            this.websocket = undefined;
        }
    }

    start() {
        if (!this.bound) {
            if (!this.url) {
                this._error(new SignalRError('INVALID_URL', 'Invalid URL.'));
                return;
            }
            if (this.url.startsWith('http:') || this.url.startsWith('https:')) {
                this.request = request;
            } else {
                this._error(new SignalRError('INVALID_PROTOCOL', 'Invalid protocol.'));
                return;
            }
            if (this.subscribedHubs.length === 0) {
                this._error(
                    new SignalRError('NO_HUB', 'No hubs have been subscribed to.')
                );
                return;
            }
            this.bound = true;
        }
        this._negotiate().then((res) => {
            this.connection = {
                ...this.connection,
                id: res.ConnectionId,
                token: res.ConnectionToken
            };
            // eslint-disable-next-line promise/always-return
            if (res.KeepAliveTimeout) {
                this.keepAlive = true;
                this.keepAliveTimeout = res.KeepAliveTimeout * 1e3;
                this.beatInterval = this.keepAliveTimeout / 4;
            } else {
                this.keepAlive = false;
            }
            this._connect();
        }).catch((error) => {
            this.connection.state = 'Disconnected';
            this._error(error);
        });
    }

    end() {
        if (this.websocket) {
            this.emit('disconnected', 'end');
            this._abort().catch(() => {
            });
        }
        this._clearReconnectTimer();
        this._clearBeatTimer();
        this._close();
    }
}
class Hub {
    constructor(client) {
        this.client = client;
        this.callbacks = {};
        this.handlers = {};
    }

    _handleCallback(invocationId, error, result) {
        const cb = this.callbacks[invocationId];
        if (cb) { cb(error, result); }
    }

    /**
   * Bind events to receive messages.
   */
    on(hubName, methodName, cb) {
        const _hubName = hubName.toLowerCase();
        let handler = this.handlers[_hubName];
        if (!handler) {
            handler = this.handlers[_hubName] = {};
        }
        handler[methodName.toLowerCase()] = cb;
    }

    /**
   * Call the hub method and get return values asynchronously
   */
    call(hubName, methodName, ...args) {
        return new Promise((resolve, reject) => {
            const messages = args.map(
                (arg) => typeof arg === 'function' || typeof arg === 'undefined' ? null : arg
            );
            const invocationId = this.client._invocationId;
            const timeoutTimer = setTimeout(() => {
                delete this.callbacks[invocationId];
                reject(new Error('Timeout'));
            }, this.client._callTimeout || this.client.callTimeout || 5e3);
            this.callbacks[invocationId] = (err, result) => {
                clearTimeout(timeoutTimer);
                delete this.callbacks[invocationId];
                return err ? reject(err) : resolve(result);
            };
            this.client._sendMessage(hubName, methodName, messages);
        });
    }

    /**
   * Invoke the hub method without return values
   */
    invoke(hubName, methodName, ...args) {
        const messages = args.map(
            (arg) => typeof arg === 'function' || typeof arg === 'undefined' ? null : arg
        );
        this.client._sendMessage(hubName, methodName, messages);
    }
}

export { Client, SignalRError };
