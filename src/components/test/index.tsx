import { config } from 'react-transition-group';
import React from 'react';
import { ThemeProvider } from 'react-jss';
import { render as testRender, RenderResult } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import merge from 'ut-function.merge';

import Context from '../Context';
import Store from '../Store';
import {State} from '../Store/Store.types';
import defaultState from './state';
export { act } from '@testing-library/react';

config.disabled = true;
window.HTMLElement.prototype.scrollIntoView = function() {};

export function render(children: React.ReactNode, initialStore: State = {}) : RenderResult {
    const theme = {
        ut: {
            classes: {},
            portalName: 'Administration'
        }
    };
    const store = <DndProvider backend={HTML5Backend}>
        <Store state={merge({}, defaultState, initialStore)}>
            <ThemeProvider theme={theme}>
                <Context.Provider value={{portalName: 'Administration Portal', customization: true}}>
                    <div data-testid="ut-front-test">
                        {children}
                    </div>
                </Context.Provider>
            </ThemeProvider>
        </Store>
    </DndProvider>;
    return testRender(store);
}
