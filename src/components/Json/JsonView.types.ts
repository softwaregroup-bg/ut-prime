import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    value?: unknown;
}

export type ComponentProps = React.FC<Props>
