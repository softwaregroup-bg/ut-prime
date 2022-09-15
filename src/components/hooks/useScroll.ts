import React from 'react';
import useWindowSize from './useWindowSize';

export default function useScroll() : [ReturnType<typeof React.useCallback>, {maxHeight: number}] {
    const [style, setHeight] = React.useState<{maxHeight: number}>();
    const windowSize = useWindowSize();

    const ref = React.useCallback(node => {
        if (node === null) return;
        const maxHeight = windowSize.height - node.getBoundingClientRect().top;
        setHeight({maxHeight: (!isNaN(maxHeight) && maxHeight > 0) ? Math.floor(maxHeight) : 0});
    }, [windowSize.height]);

    return [ref, style];
}
