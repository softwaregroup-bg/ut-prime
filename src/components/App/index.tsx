import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {Route, Switch} from 'react-router';
import { locale, addLocale } from 'primereact/api';

import LoginPage from '../Login';
import Main from '../Main';
import Context from '../Context';
import Store from '../Store';
import { ThemeProvider } from '../Theme';
import Component from '../Component';

import { ComponentProps } from './App.types';
import PageNotFound from './PageNotFound';

const App: ComponentProps = ({middleware, reducers, theme: defaultTheme, devTool, portalName, extraTitle, customization, state, onDispatcher, loginPage, registrationPage}) => {
    const [theme, setTheme] = React.useState(defaultTheme);
    const setLanguage = React.useCallback(language => setTheme(prev => ({
        ...prev,
        language,
        dir: ['ar', 'arc', 'dv', 'fa', 'ha', 'he', 'khw', 'ks', 'ku', 'ps', 'ur', 'yi'].includes(language) ? 'rtl' : 'ltr'
    })), []);
    const context = React.useMemo(() => ({portalName, devTool, customization, setLanguage, extraTitle}), [portalName, devTool, customization, setLanguage, extraTitle]);
    React.useEffect(() => {
        locale(theme?.language || 'en');
        theme?.languages && Object.entries(theme.languages).forEach(([language, options]) => addLocale(language, options));
    }, [theme?.language, theme?.languages]);

    return (
        <DndProvider backend={HTML5Backend}>
            <Store {...{middleware, reducers, state, onDispatcher}}>
                <ThemeProvider theme={theme}>
                    <Context.Provider value={context}>
                        <Switch>
                            <Route path='/login'>
                                <LoginPage register={registrationPage} language={theme?.language}/>
                            </Route>
                            <Route path='/sso/:appId/:ssoOrigin/login'>
                                <LoginPage register={registrationPage} language={theme?.language}/>
                            </Route>
                            <Route path='/register'>
                                <Component page={registrationPage} language={theme?.language}/>
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
