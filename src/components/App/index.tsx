import React from 'react';
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router';
import {ConnectedRouter} from 'connected-react-router';
import {hot} from 'react-hot-loader';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.css';
// import 'devextreme/dist/css/dx.material.blue.dark.css';

import LoginPage from '../Login';
import Main from '../Main';
import Context from '../Context';

import { StyledType } from './App.types';
import PageNotFound from './PageNotFound';

const App: StyledType = ({store, theme, portalName, history}) =>
    <Provider store={store}>
        <ConnectedRouter history={history}>
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
                                <Main />
                            </Route>
                            <Route path='*' component={PageNotFound} />
                        </Switch>
                    </MuiPickersUtilsProvider>
                </Context.Provider>
            </ThemeProvider>
        </ConnectedRouter>
    </Provider>;

export default hot(module)(App);
