import React from 'react';
import type {ButtonProps} from '../prime';

import type {ActionHandler, ActionItem} from '../types';
import type { Schema } from 'joi';

export interface Props extends ButtonProps {
    permission?: string;
    enabled?: string | boolean | Schema;
    action?: ActionHandler;
    method?: string;
    params?: string | object;
    menu?: ActionItem[];
    getValues?: () => unknown;
    successHint?: React.ReactNode;
    submit?: (event: unknown) => Promise<void>;
}

export type ComponentProps = React.FC<Props>
