import React from 'react';
import {Route, Switch} from 'react-router';
import {hot} from 'react-hot-loader';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import light from 'primereact/resources/themes/md-light-indigo/theme.css';
import dark from 'primereact/resources/themes/md-dark-indigo/theme.css';

import LoginPage from '../Login';
import Main from '../Main';
import Context from '../Context';
import Store from '../Store';

import { StyledType } from './App.types';
import PageNotFound from './PageNotFound';

let last;

const App: StyledType = ({middleware, reducers, theme, portalName, state, onDispatcher, loginPage}) => {
    last?.unuse?.();
    last = theme?.palette?.type === 'dark' ? dark?.use?.() : light?.use?.();
    return (
        <Store {...{middleware, reducers, state, onDispatcher}}>
            <ThemeProvider theme={createMuiTheme(theme)}>
                <CssBaseline />
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
    );
};

export default hot(module)(App);
