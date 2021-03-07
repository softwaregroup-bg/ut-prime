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

export default defaultState;
