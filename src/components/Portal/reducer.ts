const handlers = {
    'front.tab.show'(state, {title, path, Component, params}) {
        if (state.tabs && state.tabs.find(tab => tab.path === path)) return state;
        return {
            ...state,
            tabs: [...(state.tabs || []), {
                title,
                path,
                Component,
                params
            }]
        };
    },
    'front.tab.close'({tabs = [], ...state}, action) {
        const index = tabs.indexOf(action.data);
        if (index < 0) return {tabs, ...state};
        action.push = tabs?.[index >= tabs.length - 1 ? index - 1 : index + 1]?.path;
        return {
            ...state,
            tabs: (items => {
                items.splice(index, 1);
                return items;
            })([...tabs])
        };
    }
};

export default (state = {}, action) => {
    const handler = handlers[action.type];
    return handler ? handler(state, action) : state;
};
