import React from 'react';
import {State} from '../Store/Store.types';

const defaultState: State = {
    error: {
        open: false,
        title: '',
        message: '',
        type: '',
        statusCode: 200,
        params: {}
    },
    login: {
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
    },
    portal: {
        menu: [{
            title: ' 🏠 ',
            action: () => ({type: 'test'})
        }, {
            title: 'Main',
            path: '/main',
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
            permission: 'granted',
            path: '/granted',
            component: () => function Granted() {
                return 'access granted';
            }
        }, {
            title: 'Empty',
            permission: 'granted',
            items: [{
                title: 'Empty level 1',
                permission: 'granted',
                items: [{
                    permission: 'granted',
                    title: 'Empty level 2'
                }]
            }]
        }, {
            title: 'Denied',
            permission: 'denied'
        }],
        rightMenuItems: [{
            title: 'Help',
            action: () => ({type: 'test'})
        }, {
            title: 'Profile',
            action: () => ({type: 'test'})
        }],
        tabs: [{
            title: 'Dashboard',
            path: '/',
            Component() { return <div>dashboard content</div>; }
        }]
    }
};

export default defaultState;
