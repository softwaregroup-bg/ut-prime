import React from 'react';
import type {ComponentProps} from './ScrollBox.types';
import useScroll from '../hooks/useScroll';

const ScrollBox: ComponentProps = ({
    noScroll,
    ...rest
}) => {
    const [ref, style] = useScroll(noScroll);
    return <div
        {...rest}
        {...!noScroll && {ref, style}}
    />;
};

export default ScrollBox;
