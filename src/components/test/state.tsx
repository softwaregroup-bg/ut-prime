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
                title: 'Menu 1',
                component: function component1() {
                    return {
                        title: 'Title 1',
                        permission: 'tab1',
                        component: () => function Page1() {
                            return 'page 1 component';
                        }
                    };
                }
            }, {
                title: 'Menu 2',
                component: function component2() {
                    return {
                        title: 'Title 2',
                        permission: 'tab2',
                        component: () => function Page2() {
                            return 'page 2 component';
                        }
                    };
                }

            }]
        }, {
            title: 'Menu 3',
            component: function component3() {
                return {
                    title: 'Title 3',
                    permission: 'tab3',
                    component: () => function Page3() {
                        return 'page 3 component';
                    }
                };
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
