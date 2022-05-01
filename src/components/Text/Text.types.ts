import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLSpanElement> {
    prefix?: string;
    params?: {};
}

export type ComponentProps = React.FC<Props>
