import React from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { render as testRender } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import merge from 'ut-function.merge';

import Store from '../Store';
import {State} from '../Store/Store.types';
import defaultState from './state';

export function render(children: React.ReactNode, initialStore: State = {}) {
    const theme = createTheme({}, {
        ut: {
            classes: {},
            portalName: 'Administration'
        }
    });
    const store = <DndProvider backend={HTML5Backend}>
        <Store state={merge({}, defaultState, initialStore)}>
            <ThemeProvider theme={theme}>
                <div data-testid="ut-front-test">
                    {children}
                </div>
            </ThemeProvider>
        </Store>
    </DndProvider>;
    return testRender(store);
}
