import {createUseStyles} from 'react-jss';
import React from 'react';
import type { Schema as Validation } from 'joi';

import type {Schema, Dropdowns, WidgetReference} from '../types';

export interface Props {
    schema: Schema,
    validation?: Validation,
    params: WidgetReference[],
    init?: {},
    columns: WidgetReference[],
    resultSet?: string,
    onDropdown: (params: string[]) => Promise<Dropdowns>,
    fetch: (params: {}) => Promise<{
        pagination?: {
            recordsTotal: number
        },
        [data: string]: any
    }>;
}

export const useStyles = createUseStyles({
    report: {
        '& .p-card .p-card-body': {
            padding: 0
        }
    }
});

export type ComponentProps = React.FC<Props>
