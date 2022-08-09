import React from 'react';

export default function useBoundingClientRect() {
    const [boundingClientRect, setBoundingClientRect] = React.useState({
        bottom: undefined,
        height: undefined,
        left: undefined,
        right: undefined,
        top: undefined,
        width: undefined,
        x: undefined,
        y: undefined
    });
    const ref = React.useRef(null);

    React.useEffect(() => {
        function handleResize() {
            setBoundingClientRect(ref.current?.getBoundingClientRect?.());
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {boundingClientRect, ref};
}
