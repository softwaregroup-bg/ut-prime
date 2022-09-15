import React from 'react';
import clsx from 'clsx';
import type {ComponentProps} from './Scrollbox.types';
import {useStyles} from './Scrollbox.types';
import useScroll from '../hooks/useScroll'

const Scrollbox: ComponentProps = ({
    className,
    ...rest
}) => {
    const styles = useStyles();
    const [ref, maxHeight] = useScroll();
    return <div
            className={clsx('w-full overflow-y-auto', styles.scrollbox, className)}
            {...rest}
            ref={ref}
            style={maxHeight}
        />;
};

export default Scrollbox;
