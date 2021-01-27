import React from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { createStore } from 'redux';
import { Provider, Reducer, Store } from 'react-redux';
import { render as testRender } from '@testing-library/react';

export function render(children: React.ReactNode, initialStore: Store = {}, reducer: Reducer = () => initialStore) {
    const theme = createMuiTheme({}, {
        ut: {
            classes: {},
            portalName: 'Administration'
        }
    });
    const store = createStore(reducer, initialStore);
    return testRender(
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <div data-testid="ut-front-test">
                    {children}
                </div>
            </Provider>
        </ThemeProvider>
    );
}
