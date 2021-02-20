import React from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { createStore } from 'redux';
import { Provider, Reducer, Store } from 'react-redux';
import {createHashHistory, createMemoryHistory} from 'history';
import {Router} from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';

import Context from '../Context';

const defaultMenu = [{
    title: ' 🏠 '
}, {
    title: 'Menu 1',
    items: [{
        title: 'Submenu 1'
    }, {
        title: 'Submenu 2'
    }]
}, {
    title: 'Menu 2'
}];

export default function Wrap({
    children,
    state = {},
    menu = defaultMenu,
    portalName = 'Storybook',
    showTab = () => {}
}) {
    const initialStore: Store = state;
    const reducer: Reducer = () => initialStore;
    const theme = createMuiTheme({}, {
        ut: {
            classes: {},
            portalName: 'Administration'
        }
    });
    const store = createStore(reducer, initialStore);
    const history = (typeof window !== 'undefined') ? createHashHistory() : createMemoryHistory();
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Context.Provider value={{menu, portalName, showTab}}>
                    <Router history={history}>
                        {children}
                    </Router>
                </Context.Provider>
            </ThemeProvider>
        </Provider>
    );
}
