export default (state = {content: '', event: null}, action) => {
    return (action.type === 'front.hint.open') ? {
        ...state,
        content: action.content,
        event: action.event
    } : state;
};
