import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';
import immutable from 'immutable';

import logo from '../images/logo.png';
import {tabs} from '../Pages/Pages.types';

export interface Props {
    login: Map<string, immutable.Map<string, {}>>,
    logout: () => void,
    headerText: string,
    tabMenu: {
        tabs: tabs
    }
}

const styles = createStyles({
    headerContainer: {
        position: 'relative',
        height: '59px',
        borderBottom: '1px solid #CCCBCB',
        background: '#fff',
        color: '#373a3c',
        boxShadow: '0px 2px 3px 0px rgba(222, 222, 222, 1)',
        cursor: 'default'
    },
    headerTitle: {
        paddingLeft: 8,
        fontSize: 15,
        fontWeight: 700,
        lineHeight: '16px'
    },
    headerLogo: {
        display: 'flex',
        alignItems: 'center',
        margin: '0 0px 0 10px',
        width: 36,
        height: 36,
        background: `url(${logo})`,
        backgroundSize: 'contain',
        cursor: 'pointer'
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
