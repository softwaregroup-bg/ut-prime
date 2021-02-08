import React from 'react';
import {asyncComponent} from '../Async/Async.types';
export interface menuItem {
    title: string,
    path?: string,
    page?: asyncComponent,
    items?: menuItem[]
}

interface showTabParams {
    component: asyncComponent,
    path: string,
    title: string,
    params?: {},
    canClose?: boolean,
    isMain?: boolean
};

export type showTab = (params: showTabParams) => void;

interface contextType {
    portalName: string,
    menu: menuItem[],
    showTab: showTab
}

const defaultContext: contextType = {
    portalName: 'Administration Portal',
    menu: [],
    showTab: () => {}
};
export default React.createContext(defaultContext);
