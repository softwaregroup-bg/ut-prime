import React from 'react';
import {Reducer, Middleware, Action} from 'redux';

export interface State {
    error?: {
        open: boolean;
        title: string;
        message: string;
        type: string
    };
    loader?: {
        toJS: () => {
            open: boolean;
            requests: number;
            message: string;
        }
    };
    login?: any;
    portal?: {
        tabs: {
            title: string;
            path: string;
            Component: React.FC;
            params?: {}
        }[];
        menu: {}[];
        rightMenu?: {}[];
        rightMenuItems?: {}[]
    };
}

export interface Props {
    reducers?: {
        [key: string]: Reducer
    },
    state?: State,
    middleware?: Middleware[],
    onDispatcher?: (fn: (action: Action) => Action) => boolean
}

export type StoreComponent = React.FC<Props>
