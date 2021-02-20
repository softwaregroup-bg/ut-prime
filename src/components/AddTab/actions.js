export const ADD_TAB = Symbol('ADD_TAB');
export const CLOSE_ALL_TABS = Symbol('CLOSE_ALL_TABS');

export function addTab(pathname, title, isMain, pagename, shouldUpdate = false) {
    return {
        type: ADD_TAB,
        pathname,
        title,
        isMain,
        pagename,
        shouldUpdate
    };
}

export function closeAllTabs() {
    return {
        type: CLOSE_ALL_TABS
    };
}
