import {
    LOGIN,
    COOKIE_CHECK,
    LOGOUT
} from './actions';

const initials = ({
    firstName,
    lastName
}) => {
    if (!firstName || !lastName) {
        return 'n/a';
    }
    const regex = /[a-zA-Z]?/;
    return `${firstName.match(regex)[0]}${lastName.match(regex)[0]}`.toUpperCase();
};

export default (state = null, action: {
    type: symbol,
    methodRequestState: string,
    result: {
        language: object,
        person: {
            firstName: string,
            lastName: string
        }
    };
}) => {
    switch (action.type) {
        case LOGIN:
        case COOKIE_CHECK:
            if (action.methodRequestState === 'finished') {
                return action.result ? {
                    result: action.result,
                    language: action.result.language,
                    profile: {
                        initials: initials(action?.result?.person || {firstName: '', lastName: ''})
                    }
                } : false;
            } else return state;
        case LOGOUT:
            if (action.methodRequestState === 'finished') {
                return false;
            } else return state;
        default:
            return state;
    }
};
