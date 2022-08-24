import React from 'react';
import type { Schema as Validation } from 'joi';

import {Schema, Editors, Cards, Dropdowns} from '../types';
export interface Props extends React.HTMLAttributes<HTMLFormElement> {
    className?: string;
    schema?: Schema;
    editors?: Editors;
    /**
     * Defines layout of the cards
     */
    cards: Cards;
    dropdowns?: Dropdowns,
    layout?: (string | string[])[];
    loading?: string;
    validation?: Validation;
    design?: boolean;
    debug?: boolean;
    onSubmit?: (data: object) => void | Promise<void>;
    inspected?: string;
    onInspect?: (data: object) => void;
    setTrigger?: (trigger: (event: object) => void) => void;
    triggerNotDirty?: boolean;
    autoSubmit?: boolean;
    toolbarRef?: React.MutableRefObject<HTMLDivElement>;
    toolbar?: string;
    value?: Record<string, unknown>;
    methods?: object;
    move?: (
        type: 'card' | 'field',
        source: object,
        destination: object
    ) => void,
}

export type ComponentProps = React.FC<Props>
