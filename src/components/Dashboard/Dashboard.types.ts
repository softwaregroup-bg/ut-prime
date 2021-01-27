import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    tabName: string;
    pageText: string;
}

const styles = createStyles({
    h100pr: {
        height: '100%'
    },
    background: {
        display: 'flex',
        justifyContent: 'space-around',
        height: '100%',
        background: '#FFF'
    },
    marginTop: {
        marginTop: 150
    },
    dashboardBg: {
        margin: '0 auto',
        width: 205,
        height: 136
    },
    dashboardImg: {},
    dashboardText: {
        display: 'block',
        margin: '0 0 30px 0',
        textAlign: 'center',
        color: '#cecece'
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
