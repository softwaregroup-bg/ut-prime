import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, Redirect } from 'react-router-dom';

import { cookieCheck, logout } from '../Login/actions';
import Loader from '../Loader';
import Context from '../Text/context';

import { Styled, StyledType } from './Gate.types';

const fetchTranslations = params => ({
    type: 'core.translation.fetch',
    method: 'core.translation.fetch',
    params
});

const Gate: StyledType = ({ classes, children, cookieCheck, cookieChecked, isLogout, authenticated, logout, result, fetchTranslations }) => {
    const [loaded, setLoaded] = useState(null);

    async function load() {
        // setPermissions(result.get('permission.get').toJS());
        const language = result.getIn(['language', 'languageId']);
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

    useEffect(() => {
        if (!loaded && result) load();
    }, [loaded, result]);

    if (!cookieChecked && !isLogout) {
        const { appId } = useParams();
        cookieCheck({ appId });
        return <Loader />;
    } else if (authenticated) {
        return (
            <div className={classes.gate}>
                {loaded ? <Context.Provider value={loaded}>{children}</Context.Provider> : <Loader />}
            </div>
        );
    } else {
        return <Redirect to='/login' />;
    }
};

export default connect(
    ({ login }) => ({
        cookieChecked: login.get('cookieChecked'),
        isLogout: login.get('isLogout'),
        authenticated: login.get('authenticated'),
        result: login.get('result')
    }),
    { cookieCheck, fetchTranslations, logout }
)(Styled(Gate));
