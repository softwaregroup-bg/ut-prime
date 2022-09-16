import React from 'react';
import clsx from 'clsx';
import type {ComponentProps} from './Scrollbox.types';
import {useStyles} from './Scrollbox.types';
import useScroll from '../hooks/useScroll';

const Scrollbox: ComponentProps = ({
    noScroll,
    className,
    ...rest
}) => {
    const styles = useStyles();
    const [ref, style] = useScroll(noScroll);
    return <div
        className={clsx('overflow-y-auto', styles.scrollbox, className)}
        {...rest}
        {...!noScroll && {ref, style}}
    />;
};

export default Scrollbox;
