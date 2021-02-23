import immutable from 'immutable';

const defaultState = immutable.fromJS({
    open: false,
    requests: 0,
    message: 'Loading, please wait...'
});

export default (state = defaultState, action) => {
    if (action.suppressPreloadWindow) {
        return state;
    }
    if (action.methodRequestState === 'requested') {
        return state
            .set('open', true)
            .set('requests', state.get('requests') + 1)
            .set('message', action.prefetchWindowText || defaultState.get('message'));
    } else if (action.methodRequestState === 'finished') {
        const requests = state.get('requests');
        if (requests <= 1) {
            return state
                .set('open', false)
                .set('requests', 0);
        } else {
            return state
                .set('requests', requests - 1);
        }
    }
    return state;
};
