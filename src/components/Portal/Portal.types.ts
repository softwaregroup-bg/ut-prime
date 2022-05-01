import {createUseStyles} from 'react-jss';
import React from 'react';

import logo from '../images/logo.png';

export interface Props {
}

export const useStyles = createUseStyles({
    headerContainer: {
        zIndex: 2,
        cursor: 'default'
    },
    headerTitle: {
        paddingLeft: 16,
        fontWeight: 700,
        lineHeight: '16px'
    },
    headerLogo: {
        margin: '0 0px 0 10px',
        width: 36,
        height: 36,
        background: `url(${logo}) no-repeat center`,
        backgroundSize: 'contain',
        cursor: 'pointer'
    },
    tabs: {
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
    },
    menuGrow: {
        border: 0,
        flexGrow: 1
    },
    menu: {
        border: 0
    }
});

export type ComponentProps = React.FC<Props>
