import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    // children?: string
}

export type ComponentProps = React.FC<Props>
