import React from 'react';
import useWindowSize from './useWindowSize';

export default function useScroll() {
    const [height, setHeight] = React.useState(0);
    const windowSize = useWindowSize();

    const ref = React.useCallback(node => {
        if (node === null) return;
        const maxHeight = windowSize.height - node.getBoundingClientRect().top;
        setHeight((!isNaN(maxHeight) && maxHeight > 0) ? Math.floor(maxHeight) : 0);
    }, [windowSize.height]);

    return {ref, height};
}
