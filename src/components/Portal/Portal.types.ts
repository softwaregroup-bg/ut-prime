import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';

import logo from '../images/logo.png';

export interface Props {
}

const styles = createStyles({
    headerContainer: {
        position: 'relative',
        height: '59px',
        borderBottom: '1px solid #CCCBCB',
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
