import React from 'react';
import {Reducer, Middleware, Action} from 'redux';

export interface State {

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
