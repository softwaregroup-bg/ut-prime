import React from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider, Store } from 'react-redux';
import { render as testRender } from '@testing-library/react';
import {Router} from 'react-router';
import {createHashHistory, createMemoryHistory} from 'history';

import store from './store';

export function render(children: React.ReactNode, initialStore: Store = {}, router = false) {
    const theme = createMuiTheme({}, {
        ut: {
            classes: {},
            portalName: 'Administration'
        }
    });
    const provider = <Provider store={store(initialStore)}>
        <ThemeProvider theme={theme}>
            <div data-testid="ut-front-test">
                {children}
            </div>
        </ThemeProvider>
    </Provider>;
    if (router) {
        const history = (typeof window !== 'undefined') ? createHashHistory() : createMemoryHistory();
        return testRender(<Router history={history}>{provider}</Router>);
    }
    return testRender(provider);
}
