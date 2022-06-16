/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { ThemeProvider as Provider, createUseStyles } from 'react-jss';
import merge from 'ut-function.merge';

import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import light from 'primereact/resources/themes/lara-light-blue/theme.css';
import dark from 'primereact/resources/themes/lara-dark-blue/theme.css';
import lightCompact from 'primereact/resources/themes/saga-blue/theme.css';
import darkCompact from 'primereact/resources/themes/vela-blue/theme.css';

let last;

const themes = {
    light: {
        fontSize: 16
    },
    dark: {
        fontSize: 16
    },
    'light-compact': {
        fontSize: 14
    },
    'dark-compact': {
        fontSize: 14
    }
};

export interface Theme {
    ut: {
        classes: {
            headerLogo?: string,
            loginTop?: string,
            loginBottom?: string
        },
        portalName?: string,
    },
    fontSize?: number;
    name?: string,
    palette?: {
        type: 'dark' | 'light' | 'dark-compact' | 'light-compact';
    }
}

export const useStyles = createUseStyles(({fontSize = 14}: Theme) => ({
    '@global': {
        '@font-face': [{
            fontFamily: 'Roboto',
            fontWeight: 'normal',
            src: `url(${require('./Roboto-Regular.ttf').default}) format('truetype')`
        }, {
            fontFamily: 'Roboto',
            fontWeight: 'normal',
            fontStyle: 'italic',
            src: `url(${require('./Roboto-LightItalic.ttf').default}) format('truetype')`
        }, {
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            fontStyle: 'italic',
            src: `url(${require('./Roboto-MediumItalic.ttf').default}) format('truetype')`
        }, {
            fontFamily: 'Roboto',
            fontWeight: 600,
            src: `url(${require('./Roboto-Medium.ttf').default}) format('truetype')`
        }, {
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            src: `url(${require('./Roboto-Bold.ttf').default}) format('truetype')`
        }],
        html: {
            fontSize,
            fontFamily: 'Roboto',
            color: 'var(--text-color)',
            backgroundColor: 'var(--surface-0)'
        },
        body: {
            margin: 0
        }
    }
}));

export const ThemeProvider = ({ theme, children }: { theme: Theme, children: React.ReactNode }) => {
    last?.unuse?.();
    switch (theme?.name || theme?.palette?.type) {
        case 'custom':
            last = null;
            break;
        case 'dark':
            last = dark?.use?.();
            break;
        case 'dark-compact':
            last = darkCompact?.use?.();
            break;
        case 'light-compact':
            last = lightCompact?.use?.();
            break;
        default:
            last = light?.use?.();
    }
    const appTheme = React.useMemo(() => merge({}, themes[theme?.palette?.type || 'dark-compact'] || themes['dark-compact'], theme), [theme]);
    useStyles(appTheme);
    return <Provider theme={appTheme}>{children}</Provider>;
};
