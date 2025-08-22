import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {Route, Switch} from 'react-router';
import { locale, addLocale } from 'primereact/api';
import { useDispatch } from 'react-redux';

import LoginPage from '../Login';
import Main from '../Main';
import Context from '../Context';
import Store from '../Store';
import { ThemeProvider } from '../Theme';
import Component from '../Component';
import Text from '../Text';

import { ComponentProps } from './App.types';
import PageNotFound from './PageNotFound';

const coreLicenseCheck: ((params: unknown) => unknown) = params => ({
    type: 'core.license.check',
    method: 'core.license.check',
    params,
    suppressErrorWindow: true
});

const App: ComponentProps = ({middleware, reducers, theme: defaultTheme, devTool, portalName, extraTitleComponent, loginTitleComponent, customization, state, onDispatcher, loginPage, registrationPage, homePage}) => {
    const [theme, setTheme] = React.useState(defaultTheme);
    const setLanguage = React.useCallback(language => setTheme(prev => ({
        ...prev,
        language,
        dir: ['ar', 'arc', 'dv', 'fa', 'ha', 'he', 'khw', 'ks', 'ku', 'ps', 'ur', 'yi'].includes(language) ? 'rtl' : 'ltr'
    })), []);
    const context = React.useMemo(() => ({portalName, devTool, customization, setLanguage, extraTitleComponent, loginTitleComponent}), [portalName, devTool, customization, setLanguage, extraTitleComponent, loginTitleComponent]);
    React.useEffect(() => {
        locale(theme?.language || 'en');
        theme?.languages && Object.entries(theme.languages).forEach(([language, options]) => addLocale(language, options));
    }, [theme?.language, theme?.languages]);

    return (
        <DndProvider backend={HTML5Backend}>
            <Store {...{middleware, reducers, state, onDispatcher}}>
                <ThemeProvider theme={theme}>
                    <Context.Provider value={context}>
                        <LicenseWarning />
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
                                <Main loginPage={loginPage} homePage={homePage}/>
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

type LicenseCheck = { expired: boolean, daysLeft: number };

const LicenseWarning = () => {
    const [dismissed, setDismissed] = React.useState(false);

    const [licenseInfo, setLicenseInfo] = React.useState<LicenseCheck | null>(null);
    const dispatch = useDispatch();
    React.useEffect(() => {
        async function licenseCheck() {
            const response = await dispatch(coreLicenseCheck({})) as { result?: LicenseCheck };
            if (response?.result) {
                setLicenseInfo(response.result);
            }
        }
        licenseCheck();
    }, [dispatch]);

    if (licenseInfo?.expired) {
        return (
            <div
                style={{
                    color: 'white',
                    backgroundColor: 'red',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: '8px 24px 8px 8px'
                }}
            >
                <Text>
                    Your license has expired. Please contact your administrator.
                </Text>
            </div>
        );
    } else if (!!licenseInfo && licenseInfo.daysLeft < 30 && !dismissed) {
        const textTemplate = 'Your license will expire in {daysLeft} days. Please contact your administrator.';
        return (
            <div
                style={{
                    color: 'white',
                    backgroundColor: 'orange',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    position: 'relative',
                    padding: '8px 24px 8px 8px'
                }}
            >
                <button
                    onClick={() => setDismissed(true)}
                    style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '16px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                    title='Dismiss'
                >
                    ×
                </button>
                <Text params={{ daysLeft: licenseInfo.daysLeft }}>
                    {textTemplate}
                </Text>
            </div>
        );
    }
    return null;
};
