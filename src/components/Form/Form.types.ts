import React from 'react';
import type { Schema as Validation } from 'joi';
import type { UseFormReturn } from 'react-hook-form';
import useLayout from '../hooks/useLayout';

import {Schema, Editors, Cards, Dropdowns, Allow} from '../types';
export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    schema?: Schema;
    editors?: Editors;
    /**
     * Defines layout of the cards
     */
    cards: Cards;
    dropdowns?: Dropdowns,
    layout?: (string | string[])[];
    layoutFields?: string[];
    layoutState: ReturnType<typeof useLayout>,
    loading?: string;
    disabled?: Allow;
    enabled?: Allow;
    validation?: Validation;
    design?: boolean;
    designCards?: boolean;
    debug?: boolean;
    onSubmit?: (data: object) => void | Promise<void>;
    onLoaded?: (data: object) => Promise<object>;
    onMount?: (data: object) => void | Promise<void>;
    inspected?: string;
    onInspect?: (data: object) => void;
    onFieldChange?: string;
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
    ) => void;
    formApi?: UseFormReturn;
    isPropertyRequired?: (propertyName: string) => boolean
}

export type ComponentProps = React.FC<Props>
