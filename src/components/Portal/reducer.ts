const handlers = {
    'front.tab.show'(state, {title, path, component}) {
        return {
            ...state,
            tabs: [...(state.tabs || []), {
                title: title,
                path: path,
                component
            }]
        };
    },
    'front.tab.close'(state, {index}) {
        return {
            ...state,
            tabs: (items => {
                items.splice(index, 1);
                return items;
            })([...(state.tabs || [])])
        };
    }
};

export default (state = {}, action) => {
    const handler = handlers[action.type];
    return handler ? handler(state, action) : state;
};
