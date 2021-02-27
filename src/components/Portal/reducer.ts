const handlers = {
    'front.tab.switch'(state, {tabIndex}) {
        return {
            ...state,
            tabIndex
        };
    },
    'front.tab.show'(state, {title, path, component}) {
        return {
            ...state,
            tabs: [...(state.tabs || []), {
                title: title,
                path: path,
                component
            }],
            tabIndex: state?.tabs?.length
        };
    },
    'front.tab.close'({tabIndex = 0, tabs = [], ...state}, {data}) {
        const index = tabs.indexOf(data);
        if (index < 0) return {tabIndex, tabs, ...state};
        return {
            ...state,
            tabs: (items => {
                items.splice(index, 1);
                return items;
            })([...tabs]),
            tabIndex: [
                tabIndex,
                index >= tabs.length - 1 ? tabs.length - 2 : tabIndex,
                tabIndex - 1
            ][Math.sign(tabIndex - index) + 1]
        };
    }
};

export default (state = {}, action) => {
    const handler = handlers[action.type];
    return handler ? handler(state, action) : state;
};
