import React from 'react';
import type {ButtonProps} from 'primereact/button';

export interface Props extends ButtonProps {
    method: string;
    params?: string | object;
    submit: (event: unknown) => void
}

export type ComponentProps = React.FC<Props>
