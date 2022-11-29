import React from 'react';
import type {ButtonProps} from '../prime';

import type {ActionHandler, Selection, ActionItem} from '../types';
import type { Schema } from 'joi';

interface Props extends ButtonProps {
    permission?: string;
    enabled?: string | boolean | Schema;
    action?: ActionHandler;
    method?: string;
    params?: string | object;
    menu?: ActionItem[];
    getValues?: () => Selection;
    submit?: (event: unknown) => Promise<void>;
}

export type ComponentProps = React.FC<Props>
