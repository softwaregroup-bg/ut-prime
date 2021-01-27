import {ADD_TAB, CLOSE_ALL_TABS} from 'ut-front-react/containers/TabMenu/actionTypes';

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
