import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {Route, Switch} from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, StylesProvider, createTheme, withStyles } from '@material-ui/core/styles';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import light from 'primereact/resources/themes/md-light-indigo/theme.css';
import dark from 'primereact/resources/themes/md-dark-indigo/theme.css';
import lightCompact from 'primereact/resources/themes/mdc-light-indigo/theme.css';
import darkCompact from 'primereact/resources/themes/mdc-dark-indigo/theme.css';

import LoginPage from '../Login';
import Main from '../Main';
import Context from '../Context';
import Store from '../Store';

import { StyledType } from './App.types';
import PageNotFound from './PageNotFound';
import { Theme } from '../Theme';

const Reset = withStyles(({fontSize = 14}: Theme) => ({
    '@global': {
        html: {
            fontSize
        }
    }
}))(CssBaseline);

let last;

const App: StyledType = ({middleware, reducers, theme, portalName, state, onDispatcher, loginPage}) => {
    last?.unuse?.();
    switch (theme?.name || theme?.palette?.type) {
        case 'custom':
            last = null;
            break;
        case 'dark':
            last = dark?.use?.();
            break;
        case 'dark-compact':
            last = darkCompact?.use?.();
            break;
        case 'light-compact':
            last = lightCompact?.use?.();
            break;
        default:
            last = light?.use?.();
    }
    return (
        <DndProvider backend={HTML5Backend}>
            <Store {...{middleware, reducers, state, onDispatcher}}>
                <ThemeProvider theme={createTheme(theme)}>
                    <StylesProvider injectFirst>
                        <Reset />
                    </StylesProvider>
                    <Context.Provider value={{portalName}}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Switch>
                                <Route path='/login'>
                                    <LoginPage />
                                </Route>
                                <Route path='/sso/:appId/:ssoOrigin/login'>
                                    <LoginPage />
                                </Route>
                                <Route>
                                    <Main loginPage={loginPage}/>
                                </Route>
                                <Route path='*' component={PageNotFound} />
                            </Switch>
                        </MuiPickersUtilsProvider>
                    </Context.Provider>
                </ThemeProvider>
            </Store>
        </DndProvider>
    );
};

export default App;
