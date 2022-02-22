import React from 'react';
import {asyncComponent} from '../Async/Async.types';
export interface menuItem {
    title: string,
    path?: string,
    page?: asyncComponent,
    items?: menuItem[]
}

interface contextType {
    portalName: string,
    devTool?: boolean
}

const defaultContext: contextType = {
    portalName: 'Administration Portal',
    devTool: true
};
export default React.createContext(defaultContext);
