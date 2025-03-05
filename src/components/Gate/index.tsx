import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { useParams, Redirect } from 'react-router-dom';
import {Route, Switch} from 'react-router';

import { cookieCheck } from '../Login/actions';
import Loader from '../Loader';
import AppContext from '../Context';
import parse from '../lib/parseDictionaryMap';
import Context, {ContextType} from '../Text/context';

import { ComponentProps, Props } from './Gate.types';
import { State } from '../Store/Store.types';
import formatValue from './formatValue';

const defaultContext: ContextType = {
    language: '',
    languageCode: '',
    joiMessages: {},
    configuration: {},
    formatValue: formatValue({languageCode: 'en'})
};

const corePortalGet: ((params: unknown) => unknown) = params => ({
    type: 'core.portal.get',
    method: 'core.portal.get',
    params
});

async function load(login: State['login'], setLoaded: React.Dispatch<unknown>, corePortalGet: Props['corePortalGet']) {
    const language = login?.language?.languageId;
    const languageCode = login?.language?.iso2Code;
    const { result = {} } = await corePortalGet({
        languageId: language,
        dictName: ['text', 'actionConfirmation', 'error']
    });
    const { translations, configuration, currencies } = result;
    const dictionary = translations?.reduce(
        (prev, { dictionaryKey, translatedValue }) =>
            dictionaryKey === translatedValue ? prev : { ...prev, [dictionaryKey]: translatedValue },
        { joi: undefined }
    );

    const formattedCurrencies = currencies?.reduce((prev, { currencyId, code, scale }) => {
        prev[currencyId] = scale;
        prev[code] = scale;
        return prev;
    }, {});

    const fmtOpts = configuration?.['portal.utPrime.formatOptions'];
    const customFormatOptions = typeof fmtOpts === 'string' ? JSON.parse(fmtOpts) : fmtOpts;

    setLoaded({
        language,
        languageCode,
        configuration,
        joiMessages: dictionary?.joi !== 'joi' && parse(dictionary?.joi),
        translate: (id, text, language) => (id && dictionary?.[id]) || dictionary?.[text] || text,
        getScale: (currency) => formattedCurrencies?.[currency],
        formatValue: formatValue({ languageCode, ...customFormatOptions })
    });
}

const Gate: ComponentProps = ({ children, cookieCheck, corePortalGet, loginPage = '#/login', homePage }) => {
    const [loaded, setLoaded] = useState(null);
    const [cookieChecked, setCookieChecked] = useState(false);
    const login = useSelector((state: State) => state.login);
    const {appId} = useParams();
    const loginHash = !loginPage || loginPage.startsWith('#');
    const {setLanguage} = React.useContext(AppContext);

    useEffect(() => {
        async function check() {
            const result = await cookieCheck({ appId });
            setCookieChecked(true);
            if (result?.result?.language?.iso2Code) setLanguage(result.result.language.iso2Code);
        }

        if (!cookieChecked && !login) {
            check();
        } else if (!loaded && login) {
            load(login, setLoaded, corePortalGet);
        } else if (!loginHash && !login) {
            if (loginPage.startsWith('http://') || loginPage.startsWith('https://')) {
                window.location.href = loginPage;
            } else {
                window.location.pathname = loginPage;
            }
        } else if (loaded && !login) {
            setLoaded(false);
        }
    }, [cookieChecked, login, loaded, corePortalGet, cookieCheck, appId, loginPage, loginHash, setLanguage]);

    useEffect(() => {
        if (!login?.language?.iso2Code || !loaded || login.language.iso2Code === loaded.languageCode) return;
        setLanguage(login.language.iso2Code);
        load(login, setLoaded, corePortalGet);
    }, [login?.language?.iso2Code, login?.language?.languageId, setLoaded, setLanguage, login, loaded, corePortalGet]);
    if (!cookieChecked && !login) {
        return <Loader />;
    } else if (login) {
        return loaded ? <Context.Provider value={loaded}>
            {children}
        </Context.Provider> : <Loader open/>;
    } else {
        return <Switch>
            <Route path='/p/:path*'>
                <Context.Provider value={defaultContext}>
                    {children}
                </Context.Provider>
            </Route>
            <Route>{
                homePage
                    ? <Redirect to={`/p/${homePage}`} />
                    : !loginHash
                        ? <Loader open message='Redirecting to the login page...' />
                        : <Redirect to={loginPage?.substring?.(1) || '/login'} />
            }</Route>
        </Switch>;
    }
};

export default connect(
    null,
    { cookieCheck, corePortalGet }
)(Gate);
