import React from 'react';
import { Tooltip } from 'react-tooltip';
import type {ButtonProps} from '../prime';

import type {ActionHandler, ActionItem} from '../types';
import type { Schema } from 'joi';

export interface Props extends Omit<ButtonProps, 'tooltipOptions'> {
    permission?: string;
    enabled?: string | boolean | Schema;
    action?: ActionHandler;
    method?: string;
    params?: string | object;
    menu?: ActionItem[];
    getValues?: () => unknown;
    successHint?: React.ReactNode;
    submit?: (event: unknown) => Promise<void>;
    tooltipOptions?: Omit<Parameters<typeof Tooltip>[0], 'children'>
}

export type ComponentProps = React.FC<Props>
