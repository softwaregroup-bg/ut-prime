export default (state = {content: '', event: null}, action) => {
    return (action.type === 'front.hint.open') ? {
        ...state,
        result: null || action.result,
        error: null || action.error,
        event: action.event
    } : state;
};
