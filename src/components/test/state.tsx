import React from 'react';
import {State} from '../Store/Store.types';

const defaultState: State = {
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
                permission: 'page1',
                path: '/page1',
                component: () => function Page1() {
                    return 'page 1 component';
                }
            }, {
                title: 'Page 2',
                permission: 'page2',
                path: '/page2',
                component: () => function Page2() {
                    return 'page 2 component';
                }
            }]
        }, {
            title: 'Page 3',
            permission: 'page3',
            path: '/page3',
            component: () => function Page3() {
                return 'page 3 component';
            }
        }],
        tabs: [{
            title: 'Dashboard',
            path: '/',
            Component() { return <div>dashboard content</div>; }
        }]
    }
};

export default defaultState;
