import {LOGIN, COOKIE_CHECK} from './actions';
import Immutable from 'immutable';

export default (state = null, action: { type: Symbol; methodRequestState: string; result: null; }) => {
    if ([LOGIN, COOKIE_CHECK].includes(action.type) && action.methodRequestState === 'finished') {
        return action.result ? Immutable.fromJS(action.result) : false;
    }
    return state;
};
