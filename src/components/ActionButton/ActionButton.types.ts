import React from 'react';
import type {ButtonProps} from 'primereact/button';

import type {ActionHandler, Selection} from '../types';
export interface Props extends ButtonProps {
    permission?: string;
    enabled?: string | boolean;
    action: ActionHandler;
    params?: object;
    getValues: () => Selection;
}

export type ComponentProps = React.FC<Props>
