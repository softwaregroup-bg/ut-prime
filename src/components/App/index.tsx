import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route, Switch} from 'react-router';
import {hot} from 'react-hot-loader';
import {createHashHistory, createMemoryHistory} from 'history';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.css';
// import 'devextreme/dist/css/dx.material.blue.dark.css';

import LoginPage from '../Login';
import Main from '../Main';
import Context from '../Context';

import { StyledType } from './App.types';
import PageNotFound from './PageNotFound';

const App: StyledType = ({store, theme, portalName}) =>
    <Provider store={store}>
        <ThemeProvider theme={createMuiTheme(theme)}>
            <CssBaseline />
            <Context.Provider value={{portalName}}>
                <Router history={(typeof window !== 'undefined') ? createHashHistory() : createMemoryHistory()}>
                    <Switch>
                        <Route path='/login'>
                            <LoginPage />
                        </Route>
                        <Route path='/sso/:appId/:ssoOrigin/login'>
                            <LoginPage />
                        </Route>
                        <Route>
                            <Main />
                        </Route>
                        <Route path='*' component={PageNotFound} />
                    </Switch>
                </Router>
            </Context.Provider>
        </ThemeProvider>
    </Provider>;

export default hot(module)(App);
