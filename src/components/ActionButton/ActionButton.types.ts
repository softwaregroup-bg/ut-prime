import React from 'react';
import type {ButtonProps} from 'primereact/button';

import type {ActionHandler, Selection} from '../types';
import type { Schema } from 'joi';

export interface Props extends ButtonProps {
    permission?: string;
    enabled?: string | boolean | Schema;
    action: ActionHandler;
    params?: object;
    getValues: () => Selection;
}

export type ComponentProps = React.FC<Props>
