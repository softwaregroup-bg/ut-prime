import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLSpanElement> {
    prefix?: string;
    params?: object;
}

export type ComponentProps = React.FC<Props>
