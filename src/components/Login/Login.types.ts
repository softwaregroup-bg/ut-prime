import {createUseStyles} from 'react-jss';
import React from 'react';

import topImage from './images/topLogo.png';
import bottomImage from './images/bottomLogo.png';
import error from '../images/error.png';

export interface ILoginProps {
    identityCheck: (params: object) => Promise<{error?: {type: string, message: string}}>;
}

export const useStyles = createUseStyles({
    loginContainer: {
        display: 'flex',
        position: 'absolute',
        top: '50%',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        transform: 'translateY(-50%)'
    },
    loginLogo: {
        width: '420px',
        height: '80px'
    },
    loginPageHeader: {
        marginBottom: '55px',
        background: `url(${topImage}) no-repeat center`
    },
    loginPageFooter: {
        marginTop: '55px',
        background: `url(${bottomImage}) no-repeat center`
    },
    loginForm: {
        boxSizing: 'border-box',
        width: 420,
        padding: '30px 60px',
        backgroundColor: 'var(--surface-50)',
        borderWidth: 1,
        borderType: 'solid'
    },
    formContainer: {
        width: '100%'
    },
    formBody: {
        height: '100%'
    },
    loginTitle: {
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 16
    },
    formError: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    },
    errorMessage: {
        marginBottom: 5,
        lineHeight: '18px',
        textAlign: 'center',
        fontSize: 16,
        color: '#E84949'
    },
    errorIcon: {
        background: `url(${error}) no-repeat`,
        width: 40,
        height: 40
    }
});

export type ComponentProps = React.FC<ILoginProps>
