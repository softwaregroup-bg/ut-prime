import React from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import {createHashHistory, createMemoryHistory} from 'history';
import {Router} from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';

import Context from '../Context';
import store from './store';

export default function Wrap({
    children,
    state = {},
    portalName = 'Storybook'
}) {
    const theme = createMuiTheme({}, {
        ut: {
            classes: {},
            portalName: 'Administration'
        }
    });
    const history = (typeof window !== 'undefined') ? createHashHistory() : createMemoryHistory();
    return (
        <Provider store={store(state, history)}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Context.Provider value={{portalName}}>
                    <Router history={history}>
                        {children}
                    </Router>
                </Context.Provider>
            </ThemeProvider>
        </Provider>
    );
}
