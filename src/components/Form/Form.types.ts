import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';
import type { Schema as Validation } from 'joi';

import {Schema, Editors, Cards, Dropdowns} from '../types';
export interface Props extends Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
    className?: string;
    schema: Schema;
    editors?: Editors;
    cards: Cards;
    dropdowns?: Dropdowns,
    layout?: (string | string[])[];
    loading?: string;
    validation?: Validation;
    design?: boolean;
    onSubmit: (data: {form: {}, submit: {}}) => void;
    setTrigger?: (trigger: (event: {}) => void) => void;
    value?: any;
}

const styles = createStyles({
    component: {
        '& .p-datatable-wrapper': {
            overflowX: 'auto'
        }
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
