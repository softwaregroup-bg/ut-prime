import React from 'react';
import type {ButtonProps} from 'primereact/button';

export interface Props extends ButtonProps {
    permission?: string;
    enabled?: string | boolean;
    action: string | ((params : object) => void);
    params?: object;
    getValues: () => object;
}

export type ComponentProps = React.FC<Props>
