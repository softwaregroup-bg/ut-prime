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
        [resultSet: string]: object,
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
    details?: boolean | object;
    toolbar?: Action[];
    filter?: object;
    index?: object;
    showFilter?: boolean;
    pageSize?: number;
    table?: DataTableProps;
}

export type ComponentProps = React.FC<Props>
