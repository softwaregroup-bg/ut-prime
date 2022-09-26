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

import useDarkMode from '../hooks/useDarkMode';

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

type lazyCss = {
    use: () => {
        unuse: () => void
    }
}
export interface Theme {
    Switch?: React.FC,
    dark?: lazyCss,
    light?: lazyCss,
    dir?: 'ltr' | 'rtl',
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
            backgroundColor: 'var(--surface-0)',
            "&[dir='rtl']": {
                '& .right-0': {
                    left: '0px !important',
                    right: 'unset !important'
                },
                '& .left-0': {
                    right: '0px !important',
                    left: 'unset !important'
                },
                '& .p-float-label > label': {
                    left: 'unset !important',
                    right: '0.5rem'
                },
                '& .mr-2': {
                    marginRight: 'unset !important',
                    marginLeft: '0.5rem !important'
                }
            }
        },
        body: {
            margin: 0
        }
    }
}));

export const ThemeProvider = ({ theme, children }: { theme: Theme, children: React.ReactNode }) => {
    last?.unuse?.();
    const [isDark, Switch] = useDarkMode();
    switch (theme?.name || theme?.palette?.type) {
        case 'custom':
            last = isDark ? theme?.dark?.use?.() : theme?.light?.use?.();
            break;
        case 'dark-compact':
        case 'light-compact':
            last = isDark ? darkCompact?.use?.() : lightCompact?.use?.();
            break;
        case 'dark':
        default:
            last = isDark ? dark?.use?.() : light?.use?.();
    }
    const appTheme = React.useMemo(() => merge({Switch}, themes[theme?.palette?.type || 'dark-compact'] || themes['dark-compact'], theme), [theme, Switch]);
    useStyles(appTheme);
    if (theme.dir && (document.dir !== theme.dir)) document.dir = theme.dir;
    return <Provider theme={appTheme}>{children}</Provider>;
};
