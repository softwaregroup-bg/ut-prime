const mapErrorMessage = (resp) => {
    let returnMsg = resp.message;
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
    if (action.type === 'error.close') {
        return {
            ...state,
            open: false,
            title: '',
            message: '',
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
            type: type
        };
    }
    return state;
};
