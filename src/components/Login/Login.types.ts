import { WithStyles, withStyles, createStyles } from '@material-ui/core/styles';
import topLogo from './images/topLogo.png';
import bottomLogo from './images/bottomLogo.png';
import React from 'react';
import error from '../images/error.png';

export interface ILoginProps {
    authenticated: boolean;
    identityCheck: ({}) => Promise<{}>;
}

const styles = createStyles({
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
        width: '480px',
        height: '80px'
    },
    loginPageHeader: {
        marginBottom: '55px',
        background: `url(${topLogo}) no-repeat center`
    },
    loginPageFooter: {
        marginTop: '55px',
        background: `url(${bottomLogo}) no-repeat center`
    },
    loginForm: {
        boxSizing: 'border-box',
        width: 480,
        padding: '30px 95px 55px',
        border: '1px solid #E9E9E9',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 1px 5px 0 rgba(85,89,102, 0.25)'
    },
    formContainer: {
        width: '100%'
    },
    formBody: {
        height: '100%'
    },
    loginTitle: {
        color: '#626262',
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

export const Styled = withStyles(styles);
export type StyledType = React.FC<ILoginProps & WithStyles<typeof styles>>
