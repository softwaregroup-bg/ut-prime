import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    object?: unknown;
    transformValue?: unknown;
}

export type ComponentProps = React.FC<Props>
