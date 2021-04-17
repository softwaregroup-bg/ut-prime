import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';

import logo from '../images/logo.png';

export interface Props {
}

const styles = createStyles({
    headerContainer: {
        height: '59px',
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
        background: `url(${logo})`,
        backgroundSize: 'contain',
        cursor: 'pointer'
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
