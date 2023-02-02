import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { useParams, Redirect } from 'react-router-dom';
import merge from 'ut-function.merge';

import { cookieCheck } from '../Login/actions';
import Loader from '../Loader';
import Context from '../Text/context';
import AppContext from '../Context';
import { ConfirmPopup, ConfirmDialog } from '../prime';

import Permission from './Permission';
import { ComponentProps } from './Gate.types';
import { State } from '../Store/Store.types';
import { fnMap, defaultFormatOptions } from './formatValue';

const corePortalGet: ((params: unknown) => unknown) = params => ({
    type: 'core.portal.get',
    method: 'core.portal.get',
    params
});

const Gate: ComponentProps = ({ children, cookieCheck, corePortalGet, loginPage = '#/login' }) => {
    const [loaded, setLoaded] = useState(null);
    const [cookieChecked, setCookieChecked] = useState(false);
    const login = useSelector((state: State) => state.login);
    const {appId} = useParams();
    const loginHash = !loginPage || loginPage.startsWith('#');
    const {setLanguage} = React.useContext(AppContext);

    useEffect(() => {
        async function load() {
            const language = login?.language?.languageId;
            const languageCode = login?.language?.iso2Code;
            const { result = {} } = await corePortalGet({
                languageId: language,
                dictName: ['text', 'actionConfirmation', 'error']
            });
            const { translations, configuration, currencies } = result;
            const dictionary = translations?.reduce(
                (prev, {dictionaryKey, translatedValue}) => dictionaryKey === translatedValue ? prev : {...prev, [dictionaryKey]: translatedValue},
                {joi: undefined}
            );

            const formattedCurrencies = currencies?.reduce((prev, {currencyId, code, scale}) => {
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
                joiMessages: dictionary?.joi !== 'joi' && dictionary?.joi,
                translate: (id, text, language) => (id && dictionary?.[id]) || dictionary?.[text] || text,
                getScale: (currency) => formattedCurrencies?.[currency],
                formatValue: (value, {type, ...opts}) => {
                    const {fn, ...options} = merge({}, defaultFormatOptions[type], customFormatOptions?.[type], opts);
                    return value && fnMap[fn]?.(value, options);
                }
            });
        }

        async function check() {
            const result = await cookieCheck({ appId });
            setCookieChecked(true);
            if (result?.result?.language?.iso2Code) setLanguage(result.result.language.iso2Code);
        }

        if (!cookieChecked && !login) {
            check();
        } else if (!loaded && login) {
            load();
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

    if (!cookieChecked && !login) {
        return <Loader />;
    } else if (login) {
        return (
            <div className='h-full'>
                {loaded ? <Context.Provider value={loaded}>
                    <ConfirmPopup />
                    <ConfirmDialog />
                    <Permission>
                        {children}
                    </Permission>
                </Context.Provider> : <Loader />}
            </div>
        );
    } else if (!loginHash) {
        return <Loader open message='Redirecting to the login page...' />;
    } else {
        return <Redirect to={loginPage?.substr?.(1) || '/login'} />;
    }
};

export default connect(
    null,
    { cookieCheck, corePortalGet }
)(Gate);
