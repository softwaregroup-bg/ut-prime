import React from 'react';

export interface Props {
    noScroll?: boolean;
    className?: string;
}

export type ComponentProps = React.FC<Props>
