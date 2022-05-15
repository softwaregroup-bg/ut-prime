import {createUseStyles} from 'react-jss';
import React from 'react';
import { DataTableProps } from '../prime';

import type {Schema, Dropdowns, Action, WidgetReference} from '../types';

export interface Props {
    /**
     * Name of the key field in the result set.
     */
    keyField?: string;
    /**
     * Name of the property, in which the result set is returned.
     */
    resultSet?: string;
    /**
     * Schema defining the properties in the result set.
     */
    schema: Schema;
    /**
     * Array of property names to show as columns.
     */
    columns: WidgetReference[];
    /**
     * Data fetching async function.
     */
    fetch: (params: {
        [resultSet: string]: {},
        orderBy: {
            field: string,
            dir: string
        }[],
        paging: {
            pageSize: number,
            pageNumber: number
        }
    }) => Promise<{
        pagination?: {
            recordsTotal: number
        },
        [data: string]: any
    }>;
    subscribe?: (callback: (rows: any) => void) => () => void;
    onDropdown?: (params: string[]) => Promise<Dropdowns>,
    className?: string;
    /**
     * Fields to show in the details pane.
     */
    details?: {};
    actions?: Action[];
    filter?: {};
    index?: {};
    showFilter?: boolean;
    pageSize?: number;
    table?: DataTableProps;
}

export const useStyles = createUseStyles({
    explorer: {
        '& .p-datatable-wrapper': {
            overflowX: 'auto'
        }
    },
    details: {
        marginBottom: 15
    },
    detailsLabel: {},
    detailsValue: {}
});

export type ComponentProps = React.FC<Props>
