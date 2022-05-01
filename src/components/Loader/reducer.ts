const defaultState = {
    open: false,
    requests: 0,
    message: 'Loading, please wait...'
};

export default (state = defaultState, action) => {
    if (action.suppressPreloadWindow) {
        return state;
    }
    if (action.methodRequestState === 'requested') {
        return {
            ...state,
            open: true,
            requests: state.requests + 1,
            message: action.prefetchWindowText || defaultState.message
        };
    } else if (action.methodRequestState === 'finished') {
        if (state.requests <= 1) {
            return {
                ...state,
                open: true,
                requests: 0
            };
        } else {
            return {
                ...state,
                requests: state.requests - 1
            };
        }
    }
    return state;
};
