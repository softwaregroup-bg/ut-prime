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
    language?: string,
    languages?: Record<string, object>,
    ut: {
        classes: {
            headerLogo?: string,
            loginTop?: string,
            loginBottom?: string,
            labelRequired?: string,
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
                '& .left-0.right-0': {
                    left: '0px !important',
                    right: '0px !important'
                },
                '& .right-0': {
                    left: '0px !important',
                    right: 'unset !important'
                },
                '& .left-0': {
                    left: 'unset !important',
                    right: '0px !important'
                },
                '& .p-float-label > label': {
                    left: 'unset !important',
                    right: 'var(--inline-spacing)'
                },
                '& .mr-2': {
                    marginLeft: 'var(--inline-spacing) !important',
                    marginRight: 'unset !important'
                },
                '& .p-button-icon-left': {
                    marginLeft: 'var(--inline-spacing)',
                    marginRight: 'initial'
                },
                '& .pi-angle-double-left:before': {
                    content: '"\\e92e"'
                },
                '& .pi-angle-left:before': {
                    content: '"\\e932"'
                },
                '& .pi-angle-double-right:before': {
                    content: '"\\e92d"'
                },
                '& .pi-angle-right:before': {
                    content: '"\\e931"'
                },
                '& .p-datatable .p-datatable-tbody > tr > td': {
                    textAlign: 'right'
                },
                '& .p-calendar-w-btn-right .p-datepicker-trigger, & .p-buttonset .p-button:last-of-type': {
                    borderTopLeftRadius: 'var(--border-radius)',
                    borderBottomLeftRadius: 'var(--border-radius)',
                    borderTopRightRadius: '0px',
                    borderBottomRightRadius: '0px'
                },
                '& .p-calendar-w-btn-right .p-inputtext, & .p-inputnumber-buttons-stacked .p-inputnumber-input, & .p-buttonset .p-button:first-of-type': {
                    borderTopLeftRadius: '0px',
                    borderBottomLeftRadius: '0px',
                    borderTopRightRadius: 'var(--border-radius)',
                    borderBottomRightRadius: 'var(--border-radius)'
                },
                '& .p-inputnumber-buttons-stacked .p-button.p-inputnumber-button-up': {
                    borderTopLeftRadius: 'var(--border-radius)',
                    borderBottomLeftRadius: '0px',
                    borderTopRightRadius: '0px',
                    borderBottomRightRadius: '0px'
                },
                '& .p-inputnumber-buttons-stacked .p-button.p-inputnumber-button-down': {
                    borderTopLeftRadius: '0px',
                    borderBottomLeftRadius: 'var(--border-radius)',
                    borderTopRightRadius: '0',
                    borderBottomRightRadius: '0px'
                },
                '& .p-treeselect-close, & .p-multiselect-panel .p-multiselect-header .p-multiselect-close': {
                    marginLeft: 'initial',
                    marginRight: 'auto'
                },
                '& .p-tree .p-treenode-children': {
                    padding: '0 var(--content-padding) 0 0'
                },
                '& .p-multiselect-panel .p-multiselect-items .p-multiselect-item .p-checkbox, & .p-multiselect.p-multiselect-chip .p-multiselect-token, & .p-treeselect.p-treeselect-chip .p-treeselect-token, & .p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link .p-menuitem-icon': {
                    marginLeft: 'var(--inline-spacing)',
                    marginRight: '0px'
                },
                '& .p-multiselect.p-multiselect-chip .p-multiselect-token .p-multiselect-token-icon, & .p-chips .p-chips-multiple-container .p-chips-token .p-chips-token-icon, & .p-menubar-root-list > .p-menuitem > .p-menuitem-link .p-submenu-icon': {
                    marginLeft: '0px',
                    marginRight: 'var(--inline-spacing)'
                },
                '& ul.p-submenu-list': {
                    left: 0,
                    right: 'initial!important'
                },
                '& .p-buttonset .p-button:not(:last-child)': {
                    borderLeft: '0 none',
                    borderRight: '1px solid var(--surface-border)',
                    '&.p-highlight': {
                        borderColor: 'var(--primary-color)'
                    }
                },
                '& .pi-chevron-right, & .pi-chevron-left': {
                    rotate: '180deg'
                },
                '@media screen and (max-width: 960px)': {
                    '& .p-menubar-mobile-active .p-menubar-root-list': {
                        left: '0!important',
                        right: 'initial!important'
                    },
                    '& .p-menubar .p-menubar-root-list ul li a': {
                        paddingLeft: '0.75rem',
                        paddingRight: '2.25rem'
                    }
                }
            }
        },
        body: {
            margin: 0
        },
        '.nowrap': {
            whiteSpace: 'nowrap !important'
        },
        '.pre': {
            whiteSpace: 'pre !important'
        },
        '.pre-wrap': {
            whiteSpace: 'pre-wrap !important'
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
