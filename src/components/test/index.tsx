import React from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { render as testRender } from '@testing-library/react';
import merge from 'ut-function.merge';

import Store from '../Store';
import {State} from '../Store/Store.types';
import defaultState from './state';

export function render(children: React.ReactNode, initialStore: State = {}) {
    const theme = createMuiTheme({}, {
        ut: {
            classes: {},
            portalName: 'Administration'
        }
    });
    const store = <Store state={merge({}, defaultState, initialStore)}>
        <ThemeProvider theme={theme}>
            <div data-testid="ut-front-test">
                {children}
            </div>
        </ThemeProvider>
    </Store>;
    return testRender(store);
}
