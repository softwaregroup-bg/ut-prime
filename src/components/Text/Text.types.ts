import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLSpanElement> {
    prefix?: string;
    params?: object;
}

export interface HookParams {
    prefix?: Props['prefix'],
    params?: Props['params'],
    lang?: Props['lang'],
    id?: Props['id'],
    text?: string | React.ReactNode
}

export type ComponentProps = React.FC<Props>
