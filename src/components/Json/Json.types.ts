import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    showUnchangedValues?: boolean,
    value: unknown,
    previous?: unknown,
    keyValue?: boolean
}

export type ComponentProps = React.FC<Props>
