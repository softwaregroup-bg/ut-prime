import React from 'react';
import {State} from '../Store/Store.types';
import Immutable from 'immutable';

const defaultState: State = {
    error: {
        open: false,
        title: '',
        message: '',
        type: '',
        statusCode: 200
    },
    login: Immutable.fromJS({
        profile: {
            initials: 'SA'
        },
        result: {
            'permission.get': [{
                actionId: 'granted'
            }, {
                actionId: 'page%'
            }]
        }
    }),
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
            permission: ['page3', 'granted'],
            path: '/page3',
            component: () => function Page3() {
                return 'page 3 component';
            }
        }, {
            title: 'Page 3 denied',
            permission: ['page3', 'denied'],
            path: '/page3',
            component: () => function Page3() {
                return 'page 3 component';
            }
        }, {
            title: 'Granted',
            permission: 'granted'
        }, {
            title: 'Denied',
            permission: 'denied'
        }],
        rightMenuItems: [{
            title: 'Help'
        }, {
            title: 'Profile'
        }],
        tabs: [{
            title: 'Dashboard',
            path: '/',
            Component() { return <div>dashboard content</div>; }
        }]
    }
};

export default defaultState;
