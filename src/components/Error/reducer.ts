const defaultErrors = {
    401: 'Session closed or expired',
    403: 'Insufficient permissions for the operation',
    404: 'Resource cannot be found',
    500: 'Error was received from server. Please try again later'
};

const mapErrorMessage = (resp) => {
    let returnMsg = resp.print || (resp.statusCode && defaultErrors[resp.statusCode]) || 'Unexpected error';
    if (resp.validation && resp.validation.keys && resp.validation.keys.length > 0) {
        returnMsg = resp.validation.keys.reduce((prev, cur) => {
            prev.push(cur);
            return prev;
        }, ['Validation error in:']);
        return returnMsg.join(' ');
    }
    return returnMsg;
};

export default (state = {open: false, title: '', message: '', type: ''}, action) => {
    if (action.suppressErrorWindow) return state;
    if (action.type === 'front.error.close') {
        return {
            ...state,
            open: false,
            title: '',
            message: '',
            statusCode: 200,
            type: ''
        };
    }
    if (action.error) {
        const msg = (mapErrorMessage(action.error) || mapErrorMessage(state.message));
        const statusMessage = action.error.statusMessage;
        const statusCode = action.error.statusCode;
        let title = 'Error';
        const type = action.error.type;
        if (statusMessage) {
            title = `${statusMessage}`;
            if (statusCode) {
                title += `(${statusCode})`;
            }
        }

        return {
            ...state,
            open: true,
            title: title,
            message: msg,
            statusCode,
            type
        };
    }
    return state;
};
