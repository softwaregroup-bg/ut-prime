import {createUseStyles} from 'react-jss';
import React from 'react';
import type { Schema as Validation } from 'joi';

import type {Schema, Dropdowns, WidgetReference} from '../types';

export interface Props {
    schema: Schema,
    validation?: Validation,
    params: WidgetReference[],
    init?: Record<string, unknown>,
    columns: WidgetReference[],
    resultSet?: string,
    onDropdown: (params: string[]) => Promise<Dropdowns>,
    fetch: (params: object) => Promise<{
        pagination?: {
            recordsTotal: number
        },
        [data: string]: unknown
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
