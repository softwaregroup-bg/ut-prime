import {LOGIN, COOKIE_CHECK} from './actions';
import Immutable from 'immutable';

export default (state = null, action: { type: Symbol; methodRequestState: string; result: {language: {}}; }) => {
    if ([LOGIN, COOKIE_CHECK].includes(action.type) && action.methodRequestState === 'finished') {
        //! todo simplify
        return action.result ? Immutable.fromJS({
            result: action.result,
            language: action.result.language
        }) : false;
    }
    return state;
};
