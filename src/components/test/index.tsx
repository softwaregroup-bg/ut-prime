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
import {Translate} from '../Text/Text.mock';
export { act } from '@testing-library/react';

config.disabled = true;
window.HTMLElement.prototype.scrollIntoView = function() {};

export function render(children: React.ReactNode, initialStore: State = {}, language = undefined, middleware = undefined) : RenderResult {
    const theme = {
        ut: {
            classes: {},
            portalName: 'Administration Portal'
        }
    };
    const store = <DndProvider backend={HTML5Backend}>
        <Store state={merge({}, defaultState, initialStore)} middleware={middleware}>
            <ThemeProvider theme={theme}>
                <Context.Provider value={{portalName: 'Administration Portal', customization: true}}>
                    {language ? <Translate language={language}>
                        <div data-testid="ut-front-test">
                            {children}
                        </div>
                    </Translate> : <div data-testid="ut-front-test">
                        {children}
                    </div>}
                </Context.Provider>
            </ThemeProvider>
        </Store>
    </DndProvider>;
    return testRender(store);
}
