import React from 'react';
import {Reducer, Middleware, Action, AnyAction} from 'redux';
import type { MenuItem as PrimeMenuItem } from 'primereact/menuitem';
export interface MenuItem extends PrimeMenuItem {
    title: string;
    path?: string;
    component?: () => any;
    tab?: (params: object) => Promise<{
        title: string;
        component?: () => any
    }>,
    params?: {
        id: string | number
    },
    permission?: string | string[],
    items?: MenuItem[] | MenuItem[][];
    action?: () => AnyAction
}
export interface State {
    error?: {
        open: boolean;
        title: string;
        message: string;
        details: string;
        type: string;
        statusCode: number;
        params: object;
    };
    loader?: {
        open: boolean;
        requests: number;
        message: string;
    };
    login?: {
        language?: {
            languageId: string | number;
        },
        profile?: {
            initials: string;
        };
        result?: {
            'permission.get': {actionId: string}[]
        }
    };
    portal?: {
        tabs: {
            title: string;
            path: string;
            Component: React.FC;
            params?: object
        }[];
        hideTabs?: boolean;
        menu: MenuItem[];
        menuClass?: 'menu' | 'menuGrow';
        rightMenu?: MenuItem[];
        rightMenuClass?: 'menu' | 'menuGrow';
        rightMenuItems?: MenuItem[]
    };
}

export interface Props {
    reducers?: {
        [key: string]: Reducer
    },
    /**
     * The initial Redux state.
     */
    state?: State,
    middleware?: Middleware[],
    onDispatcher?: (fn: (action: Action) => Action) => boolean
}

export type StoreComponent = React.FC<Props>
