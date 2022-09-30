import React from 'react';
import type {ComponentProps} from './ScrollBox.types';
import useScroll from '../hooks/useScroll';

const ScrollBox: ComponentProps = ({
    noScroll,
    absoluteHeight,
    watch,
    offset,
    ...rest
}) => {
    const [ref, style] = useScroll(noScroll, absoluteHeight, watch, offset);
    return <div
        {...rest}
        {...!noScroll && {ref, style}}
    />;
};

export default ScrollBox;
