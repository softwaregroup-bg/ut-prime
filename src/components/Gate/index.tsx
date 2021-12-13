import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { useParams, Redirect } from 'react-router-dom';

import { cookieCheck } from '../Login/actions';
import Loader from '../Loader';
import Context from '../Text/context';

import Permission from './Permission';
import { Styled, StyledType } from './Gate.types';
import { State } from '../Store/Store.types';

const fetchTranslations: ((params: any) => any) = params => ({
    type: 'core.translation.fetch',
    method: 'core.translation.fetch',
    params
});

const Gate: StyledType = ({ classes, children, cookieCheck, fetchTranslations, loginPage = '#/login' }) => {
    const [loaded, setLoaded] = useState(null);
    const [cookieChecked, setCookieChecked] = useState(false);
    const login = useSelector((state: State) => state.login || false);
    const {appId} = useParams();
    const loginHash = !loginPage || loginPage.startsWith('#');

    useEffect(() => {
        async function load() {
            // setPermissions(result.get('permission.get').toJS());
            const language = login?.language?.languageId;
            const translations = await fetchTranslations({
                languageId: language,
                dictName: ['text', 'actionConfirmation']
            });
            const dictionary = translations?.result?.translations?.reduce(
                (prev, {dictionaryKey, translatedValue}) => dictionaryKey === translatedValue ? prev : {...prev, [dictionaryKey]: translatedValue},
                {}
            );
            setLoaded({
                language,
                translate: text => dictionary?.[text] || text
            });
        }

        async function check() {
            await cookieCheck({ appId });
            setCookieChecked(true);
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
    }, [cookieChecked, login, loaded, fetchTranslations, cookieCheck, appId, loginPage, loginHash]);

    if (!cookieChecked && !login) {
        return <Loader />;
    } else if (login) {
        return (
            <div className='h-full'>
                {loaded ? <Context.Provider value={loaded}>
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
    { cookieCheck, fetchTranslations }
)(Styled(Gate));
