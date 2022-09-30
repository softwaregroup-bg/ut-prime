import React from 'react';
import useWindowSize from './useWindowSize';

export default function useScroll(disabled?: boolean, absolute?: boolean, watch: React.DependencyList = [], offset?: (node: Element) => number) : [
    ReturnType<typeof React.useCallback>, {maxHeight?: number, height?: number}
] {
    const [style, setHeight] = React.useState<{maxHeight?: number, height?: number}>();
    const windowSize = useWindowSize();
    const ref = React.useCallback(node => {
        if (node === null || !node.offsetParent) return;
        const maxHeight = (windowSize.height - node.getBoundingClientRect().top) + (offset ? offset(node) : 0);
        setHeight({[absolute ? 'height' : 'maxHeight']: (!isNaN(maxHeight) && maxHeight > 0) ? Math.floor(maxHeight) : 0});

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [windowSize, absolute, ...watch]);

    return disabled ? [undefined, undefined] : [ref, style];
}
