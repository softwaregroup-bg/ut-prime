import React from 'react';
import { createStore } from 'redux';
import { Reducer, Store } from 'react-redux';
import merge from 'ut-function.merge';

const defaultState: Store = {
    portal: {
        menu: [{
            title: ' 🏠 '
        }, {
            title: 'Main',
            items: [{
                title: 'Page 1',
                page: () => 'page 1 component'
            }, {
                title: 'Page 2',
                page: () => 'page 2 component'
            }]
        }, {
            title: 'Page 3',
            page: () => 'page 3 component'
        }],
        tabs: [{
            title: 'Dashboard',
            path: '/',
            component: () => function Component() { return <div>dashboard content</div>; }
        }]
    }
};

const handlers = {
    'front.tab.show'(state, {title, path, component}) {
        return {
            ...state,
            portal: {
                ...state.portal,
                tabs: [...state.portal.tabs, {
                    title: title,
                    path: path,
                    component: () => component
                }]
            }
        };
    },
    'front.tab.close'(state, {index}) {
        return {
            ...state,
            portal: {
                ...state.portal,
                tabs: (items => {
                    items.splice(index, 1);
                    return items;
                })([...state.portal.tabs])
            }
        };
    }
};

export default state => {
    const reducer: Reducer = (prevState = merge(defaultState, state), action) => {
        const handler = handlers[action.type];
        return handler ? handler(prevState, action) : prevState;
    };
    return createStore(reducer, merge(defaultState, state));
};
