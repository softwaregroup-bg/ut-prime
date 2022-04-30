import React from 'react';
import { ThemeProvider, createTheme, withStyles, createStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import merge from 'ut-function.merge';

import Context from '../Context';
import Store from '../Store';
import defaultState from './state';

const styles = createStyles({
    '@global': {
        html: {
            fontSize: 14
        }
    }
});

function Wrap({
    children,
    state = {},
    portalName = 'Storybook'
}) {
    const theme = createTheme({
        palette: {
            type: 'dark'
        }
    }, {
        ut: {
            classes: {},
            portalName: 'Administration'
        }
    });
    return (
        <DndProvider backend={HTML5Backend}>
            <Store state={merge({}, defaultState, state)}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Context.Provider value={{portalName, devTool: true}}>
                        {children}
                    </Context.Provider>
                </ThemeProvider>
            </Store>
        </DndProvider>
    );
}

export default withStyles(styles)(Wrap);
