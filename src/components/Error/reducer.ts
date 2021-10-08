import {LOGOUT} from '../Login/actions';

import errorMessage from './errorMessage';

export default (state = {open: false, title: '', message: '', type: ''}, action) => {
    if (['front.error.close', LOGOUT].includes(action.type)) {
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
        if (action.suppressErrorWindow) return state;
        const msg = (errorMessage(action.error) || errorMessage(state.message));
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
