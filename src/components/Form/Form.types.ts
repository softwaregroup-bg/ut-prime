import {createUseStyles} from 'react-jss';
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
    onSubmit?: (data: {}) => void | Promise<void>;
    setTrigger?: (trigger: (event: {}) => void) => void;
    triggerNotDirty?: boolean;
    autoSubmit?: boolean;
    value?: any;
    methods?: any;
}

export const useStyles = createUseStyles({
    form: {
        '& .p-datatable-wrapper': {
            overflowX: 'auto'
        }
    }
});

export type ComponentProps = React.FC<Props>
