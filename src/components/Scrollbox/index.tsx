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
    const [ref, maxHeight] = useScroll(noScroll);
    return noScroll
        ? <div className={className} {...rest}/>
        : <div
            className={clsx('overflow-y-auto', styles.scrollbox, className)}
            {...rest}
            ref={ref}
            style={maxHeight}
        />
};

export default Scrollbox;
