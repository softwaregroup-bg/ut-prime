import React from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import merge from 'ut-function.merge';

import Context from '../Context';
import Store from '../Store';
import defaultState from './state';

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
    return (
        <Store state={merge({}, defaultState, state)}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Context.Provider value={{portalName}}>
                    {children}
                </Context.Provider>
            </ThemeProvider>
        </Store>
    );
}
