import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';
import type { Schema } from 'joi';

import type {Properties, Dropdowns} from '../types';

export interface Props {
    properties: Properties,
    validation?: Schema,
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
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
