import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Store } from 'react-redux';
import merge from 'ut-function.merge';
import {connectRouter, routerMiddleware} from 'connected-react-router';

import middleware from '../middleware';
import * as reducers from '../reducers';

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
                component: function page1() {
                    return () => 'page 1 component';
                }
            }, {
                title: 'Page 2',
                component: function page2() {
                    return () => 'page 2 component';
                }
            }]
        }, {
            title: 'Page 3',
            component: function page3() {
                return () => 'page 3 component';
            }
        }],
        tabs: [{
            title: 'Dashboard',
            path: '/',
            component: () => function Component() { return <div>dashboard content</div>; }
        }]
    }
};

function store(state = {}, history): Store<{}> {
    return createStore(combineReducers({
        router: connectRouter(history),
        ...reducers
    }), merge({}, defaultState, state),
    applyMiddleware(middleware, routerMiddleware(history))
    );
};

export default store;
