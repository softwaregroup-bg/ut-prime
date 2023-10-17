import React from 'react';
import {State} from '../Store/Store.types';

import Text from '../Text';

const defaultState: State = {
    error: {
        open: false,
        title: '',
        message: '',
        type: '',
        details: '',
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
            }, {
                actionId: 'portal.customization.edit'
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
                    return <Text>page 1 component</Text>;
                }
            }, {
                title: 'Page 2',
                permission: 'page2',
                path: '/page2',
                component: () => function Page2() {
                    return <Text>page 2 component</Text>;
                }
            }]
        }, {
            title: 'Page 3',
            permission: ['page3', 'granted'],
            path: '/page3',
            component: () => function Page3() {
                return <Text>page 3 component</Text>;
            }
        }, {
            title: 'Page 3 denied',
            permission: ['page3', 'denied'],
            path: '/page3',
            component: () => function Page3() {
                return 'page 3 component';
            }
        }, {
            id: '/page4',
            title: 'Page 4',
            component: 'some.page.component',
            params: {id: 1, name: 'value'}
        }, {
            title: 'Granted',
            permission: 'granted',
            path: '/granted',
            component: () => function Granted() {
                return <Text>access granted</Text>;
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
            id: 'help',
            title: 'Help',
            action: () => ({type: 'test'})
        }, {
            id: 'profile',
            title: 'Profile',
            action: () => ({type: 'test'})
        }],
        tabs: [{
            title: 'Dashboard',
            path: '/',
            Component() { return <div><Text>dashboard content</Text></div>; }
        }]
    }
};

export default defaultState;
