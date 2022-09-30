import React from 'react';

export interface Props {
    noScroll?: boolean;
    absoluteHeight?: boolean;
    watch?: React.DependencyList;
    offset?: (node: Element) => number;
    className?: string;
}

export type ComponentProps = React.FC<Props>
