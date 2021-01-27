import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';
import error from '../images/error.png';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    open: boolean,
    message: React.ReactNode,
    title: string,
    type: string,
    close: () => void,
    logout: () => void
}

const styles = createStyles({
    errorIconWrap: {
        display: 'block',
        width: 40,
        margin: '0 auto',
        textAlign: 'center',
        marginBottom: 10
    },
    errorIcon: {
        width: 40,
        height: 40,
        background: `url(${error})`
    },
    errorMessageWrap: {
        display: 'block',
        width: '100%',
        textAlign: 'center',
        color: '#E84949'
    },
    errorButtonWrap: {
        display: 'block',
        margin: 10,
        textAlign: 'center'
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
