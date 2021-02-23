import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Store } from 'react-redux';
import merge from 'ut-function.merge';
import portal from '../Portal/reducer';
import error from '../Error/reducer';
import loader from '../Loader/reducer';
import login from '../Login/reducer';

const defaultState: Store = {
    error: {},
    loader: {},
    login: {},
    portal: {
        menu: [{
            title: ' 🏠 '
        }, {
            title: 'Main',
            items: [{
                title: 'Page 1',
                page: () => () => 'page 1 component'
            }, {
                title: 'Page 2',
                page: () => () => 'page 2 component'
            }]
        }, {
            title: 'Page 3',
            page: () => () => 'page 3 component'
        }],
        tabs: [{
            title: 'Dashboard',
            path: '/',
            component: () => function Component() { return <div>dashboard content</div>; }
        }]
    }
};

export default (state = {}) => {
    return createStore(combineReducers({portal, error, loader, login}), merge({}, defaultState, state));
};
