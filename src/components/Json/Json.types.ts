import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    showUnchangedValues?: boolean,
    value: unknown,
    previous?: unknown,
    schema?: unknown,
    keyValue?: boolean
}

export type ComponentProps = React.FC<Props>
