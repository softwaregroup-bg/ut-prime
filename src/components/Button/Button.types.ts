import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLButtonElement> {
    className?: string;
    button?: string;
    sizeType?: string;
    fullWidth?: boolean;
}

export type ComponentProps = React.FC<Props>
