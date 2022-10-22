import React from 'react';
import type {ButtonProps} from '../prime';

export interface Props extends ButtonProps {
    method: string;
    params?: string | object;
    submit: (event: unknown) => void
}

export type ComponentProps = React.FC<Props>
