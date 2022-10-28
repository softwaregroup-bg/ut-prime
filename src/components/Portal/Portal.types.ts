import {createUseStyles} from 'react-jss';
import React from 'react';

import logo from '../images/logo.png';

export type Props = object

export const useStyles = createUseStyles({
    headerContainer: {
        zIndex: 2,
        cursor: 'default'
    },
    headerTitle: {
        '&.p-component': {
            paddingLeft: 16,
            fontWeight: 700,
            lineHeight: '16px'
        }
    },
    headerLogo: {
        '&.p-component': {
            margin: '0 0px 0 10px',
            width: 36,
            height: 36,
            background: `url(${logo}) no-repeat center`,
            backgroundSize: 'contain',
            cursor: 'pointer'
        }
    },
    tabs: {
        '&.p-tabview': {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            '& .p-tabview-panels': {
                padding: 0,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
            },
            '& .p-tabview-panel': {
                flexGrow: 1
            }
        }
    },
    menuGrow: {
        '&.p-menubar': {
            border: 0,
            flexGrow: 1
        }
    },
    menu: {
        '&.p-menubar': {
            border: 0
        }
    },
    '@media (max-width: 960px)': {
        menu: {
            '&.p-menubar': {
                flexGrow: 1
            }
        }
    },
    rightMenu: {
        '&.p-menubar': {
            border: 0
        },
        '&.p-menubar ul.p-submenu-list': {
            right: 0
        },
        '&.p-menubar.p-menubar-mobile-active ul.p-menubar-root-list': {
            right: 0,
            left: 'initial',
            minWidth: 200
        }
    }
});

export type ComponentProps = React.FC<Props>
