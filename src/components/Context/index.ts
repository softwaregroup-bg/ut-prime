import React from 'react';
import {asyncComponent} from '../Async/Async.types';
export interface menuItem {
    title: string,
    path?: string,
    page?: asyncComponent,
    items?: menuItem[]
}

interface contextType {
    customization: boolean,
    portalName: string,
    devTool?: boolean,
    setLanguage?: (language: string) => void,
    extraTitle?: string
}

const defaultContext: contextType = {
    customization: false,
    portalName: 'Administration Portal',
    devTool: true
};
export default React.createContext(defaultContext);
