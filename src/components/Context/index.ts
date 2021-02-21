import React from 'react';
import {asyncComponent} from '../Async/Async.types';
export interface menuItem {
    title: string,
    path?: string,
    page?: asyncComponent,
    items?: menuItem[]
}

interface contextType {
    portalName: string
}

const defaultContext: contextType = {
    portalName: 'Administration Portal'
};
export default React.createContext(defaultContext);
