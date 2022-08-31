import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {Route, Switch} from 'react-router';

import LoginPage from '../Login';
import Main from '../Main';
import Context from '../Context';
import Store from '../Store';
import { ThemeProvider } from '../Theme';

import { ComponentProps } from './App.types';
import PageNotFound from './PageNotFound';

const App: ComponentProps = ({middleware, reducers, theme, devTool, portalName, customization, state, onDispatcher, loginPage}) => {
    const context = React.useMemo(() => ({portalName, devTool, customization}), [portalName, devTool, customization]);

    return (
        <DndProvider backend={HTML5Backend}>
            <Store {...{middleware, reducers, state, onDispatcher}}>
                <ThemeProvider theme={theme}>
                    <Context.Provider value={context}>
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
                    </Context.Provider>
                </ThemeProvider>
            </Store>
        </DndProvider>
    );
};

export default App;
