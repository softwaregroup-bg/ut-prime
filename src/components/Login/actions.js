export const LOGIN = Symbol('LOGIN');
export const BIO_LOGIN = Symbol('BIO_LOGIN');
export const COOKIE_CHECK = Symbol('COOKIE_CHECK');
export const LOGOUT = Symbol('LOGOUT');

const getTimezone = () => {
    const offset = (new Date()).getTimezoneOffset();
    const sign = offset > 0 ? '-' : '+';
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) - (hours * 60);
    return `${sign}${('00' + hours.toString()).substr(-2)}:${('00' + minutes.toString()).substr(-2)}`;
};

export const identityCheck = (params) => ({
    type: LOGIN,
    method: 'identity.check',
    suppressErrorWindow: true,
    params: Object.assign(params, {$http: {uri: '/login'}, timezone: getTimezone(), channel: 'web'})
});

export const bioScan = () => ({
    type: BIO_LOGIN,
    method: 'bio.scan',
    suppressErrorWindow: true
});

export const cookieCheck = (params) => ({
    type: COOKIE_CHECK,
    method: 'identity.check',
    suppressErrorWindow: true,
    params: Object.assign({channel: 'web'}, (params || {}))
});

export const logout = () => ({
    type: LOGOUT,
    method: 'identity.closeSession',
    suppressErrorWindow: true,
    params: {}
});
