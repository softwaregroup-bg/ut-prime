import React from 'react';
import {createUseStyles} from 'react-jss';

export interface Props {
    noScroll?: boolean;
    className?: string;
    children: any;
}

export type ComponentProps = React.FC<Props>

export const useStyles = createUseStyles({
    scrollbox: {
    }
});
