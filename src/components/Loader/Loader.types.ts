import {WithStyles, withStyles, createStyles, Theme} from '@material-ui/core/styles';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    message?: string;
    open?: boolean;
}

const styles = (theme: Theme) => createStyles({
    '@keyframes rotate': {
        from: {
            transform: 'rotate(0deg)',
            msTransform: 'rotate(0deg)',
            MozTransform: 'rotate(0deg)',
            WebkitTransform: 'rotate(0deg)',
            OTransform: 'rotate(0deg)'
        },

        to: {
            transform: 'rotate(360deg)',
            msTransform: 'rotate(360deg)',
            MozTransform: 'rotate(360deg)',
            WebkitTransform: 'rotate(360deg)',
            OTransform: 'rotate(360deg)'
        }
    },
    loaderContainer: {
        position: 'fixed',
        top: '0',
        left: '0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        zIndex: 9998
    },
    overlay: {
        position: 'absolute',
        top: '0',
        left: '0',
        height: '100%',
        width: '100%',
        backgroundColor: theme.palette.background.default,
        opacity: 0.7
    },
    loader: {
        height: 35,
        width: 35,
        borderRadius: '100%',
        border: '3px solid #4096fd',
        borderBottomColor: 'transparent',
        animation: '$rotate 0.8s linear infinite'
    },
    message: {
        marginTop: 20,
        fontSize: 16,
        fontColor: '#373a3c',
        fontFamily: 'Roboto, Arial',
        zIndex: 1
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
