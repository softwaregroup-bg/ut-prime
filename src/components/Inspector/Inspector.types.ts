import React from 'react';

export interface Props {
    className?: string;
    object: object;
    property: string | string[];
    onChange?: (params: object) => void
}

export type ComponentProps = React.FC<Props>
