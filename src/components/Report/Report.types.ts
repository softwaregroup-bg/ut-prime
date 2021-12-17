import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';
import type { Schema as Validation } from 'joi';

import type {Schema, Dropdowns} from '../types';

export interface Props {
    schema: Schema,
    validation?: Validation,
    params: string[],
    columns: string[],
    resultSet?: string,
    onDropdown: (params: string[]) => Promise<Dropdowns>,
    fetch: (params: {}) => Promise<{
        pagination?: {
            recordsTotal: number
        },
        [data: string]: any
    }>;
}

const styles = createStyles({
    component: {
    },
    report: {
        '& .p-card .p-card-body': {
            padding: 0
        }
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
