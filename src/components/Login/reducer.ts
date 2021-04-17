import {
    LOGIN,
    COOKIE_CHECK,
    LOGOUT
} from './actions';
import Immutable from 'immutable';

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
    type: Symbol,
    methodRequestState: string,
    result: {
        language: {},
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
                return action.result ? Immutable.fromJS({
                    result: action.result,
                    language: action.result.language,
                    profile: {
                        initials: initials(action?.result?.person)
                    }
                }) : false;
            } else return state;
        case LOGOUT:
            return false;
        default:
            return state;
    }
};
