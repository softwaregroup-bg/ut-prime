import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import merge from 'ut-function.merge';

import Context from '../Context';
import Store from '../Store';
import type { Theme } from '../Theme';
import { ThemeProvider } from '../Theme';
import defaultState from './state';
import {Translate} from '../Text/Text.mock';
import {createUseStyles} from 'react-jss';

const useLabelStyles = createUseStyles({
    labelRequired: {
        '&:after': {
            content: '"*"'
        }
    }
});

function Wrap({
    children,
    dir,
    language,
    type,
    state = {},
    middleware,
    portalName = 'Storybook'
}) {
    const classes = useLabelStyles();
    const theme: Theme = {
        palette: {
            type: type ?? 'dark-compact'
        },
        ut: {
            classes: {
                labelRequired: classes.labelRequired
            },
            portalName: 'Administration'
        },
        dir
    };
    return (
        <DndProvider backend={HTML5Backend}>
            <Store state={merge({}, defaultState, state)} middleware={middleware}>
                <ThemeProvider theme={theme}>
                    <Context.Provider value={{portalName, devTool: true, customization: true}}>
                        <Translate language={language}>
                            {children}
                        </Translate>
                    </Context.Provider>
                </ThemeProvider>
            </Store>
        </DndProvider>
    );
}

export default Wrap;
