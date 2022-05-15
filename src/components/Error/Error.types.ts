import {createUseStyles} from 'react-jss';
import React from 'react';
import error from '../images/error.png';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Default error message to be shown.
     */
    message?: React.ReactNode,
    /**
     * Default params for the message
     */
    params?: {}
}

export const useStyles = createUseStyles({
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

export type ComponentProps = React.FC<Props>
