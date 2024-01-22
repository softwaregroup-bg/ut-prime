import React from 'react';
import { Client as SignalRclient } from './signalr';
import RegulaClient from './client';

const useRegulaClient = ({url, disconnect}) => React.useMemo(() => new RegulaClient(url, disconnect), [url, disconnect]);

const useRegulaHandlers = ({device, handle, url, setConnected, ws}) => {
    const onProcessingFinished = React.useCallback(async() => {
        const result = await device.getResult();
        handle(result);
    }, [handle, device]);
    const notifyRfidRequestHandled = React.useCallback(async() => {
        await device.notifyRfidRequestHandled();
    }, [device]);
    const notifyPortraitRequestHandled = React.useCallback(async() => {
        await device.notifyPortraitRequestHandled();
    }, [device]);
    const connect = React.useCallback(async() => {
        setConnected(null);
        const signalrWSClient = new SignalRclient(url + '/signalr', ['EventsHub']);
        signalrWSClient.connection.hub.on('EventsHub', 'OnProcessingFinished', function() {
            onProcessingFinished();
        });
        signalrWSClient.connection.hub.on('EventsHub', 'OnRFIDRequest', function() {
            notifyRfidRequestHandled();
        });
        signalrWSClient.connection.hub.on('EventsHub', 'OnExtPortraitRequest', function() {
            notifyPortraitRequestHandled();
        });
        ws.current = signalrWSClient;
        try {
            const deviceConnection = await device.connect();
            if (!deviceConnection) {
                setConnected(false);
                return false;
            };
        } catch (e) {
            setConnected(false);
            return false;
        }
        const wsConnection = await new Promise(resolve => {
            signalrWSClient.on('connected', () => {
                resolve(true);
            });
            signalrWSClient.on('error', function(data) {
                // eslint-disable-next-line no-console
                console.error(data);
                resolve(false);
            });
            signalrWSClient
                .start();
        });
        setConnected(wsConnection);
        return wsConnection;
    }, [url, device, onProcessingFinished, notifyPortraitRequestHandled, notifyRfidRequestHandled, setConnected, ws]);

    return connect;
};

export default function useRegula({handle, url}) {
    const ws = React.useRef(null);
    const [connected, setConnected] = React.useState(null);
    const disconnect = React.useCallback(() => {
        setConnected(false);
        ws.current?.end?.();
    }, []);
    const device = useRegulaClient({url, disconnect});
    const connect = useRegulaHandlers({device, handle, url, setConnected, ws});
    React.useEffect(() => {
        connect();
        return () => {
            disconnect();
            device.disconnect();
        };
    }, [connect, disconnect, device]);

    return {connected, connect, device};
};
