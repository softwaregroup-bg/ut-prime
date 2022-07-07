import React from 'react';
import type {ButtonProps} from 'primereact/button';

export interface Props extends ButtonProps {
    permission?: string;
    enabled?: string | boolean;
    action: (({
        id: any,
        current: object,
        selected: array
    }) => void) | string | ((params: object, $meta: object) => Promise<object>);
    params?: object;
    getValues: () => object;
}

export type ComponentProps = React.FC<Props>
