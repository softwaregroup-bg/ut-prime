import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';

import logo from '../images/logo.png';
import type {utTheme} from '../App/App.types';

export interface Props {
}

const styles = ({
    ut: {
        headerLogo
    } = {}
}: utTheme) => createStyles({
    '@global': {
        html: {
            fontSize: 14
        }
    },
    headerContainer: {
        zIndex: 2,
        cursor: 'default'
    },
    headerTitle: {
        paddingLeft: 16,
        paddingRight: 16,
        fontSize: 15,
        fontWeight: 700,
        lineHeight: '16px'
    },
    headerLogo: {
        margin: '0 0px 0 10px',
        width: 36,
        height: 36,
        background: `url(${logo}) no-repeat center`,
        backgroundSize: 'contain',
        cursor: 'pointer',
        ...headerLogo
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

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
