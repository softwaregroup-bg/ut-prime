import React from 'react';
import Joi from 'joi';
import { DataTableProps, DataViewProps } from '../prime';

import type {Schema, Cards, Editors, Dropdowns, WidgetReference, Layouts} from '../types';

interface Customization {
    schema?: Schema,
    card?: Cards,
    layout?: Layouts
}

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
     * Data fetching async function.
     */
    fetch: (params: {
        [resultSet: string]: object,
        orderBy?: {
            field: string,
            dir: string
        }[],
        paging?: {
            pageSize: number,
            pageNumber: number
        }
    }) => Promise<{
        pagination?: {
            recordsTotal: number
        },
        [data: string]: unknown
    }>;
    fetchTransform?: (params: unknown) => unknown,
    subscribe?: (callback: (rows: [] | Record<string, object>) => void) => () => void;
    onDropdown?: (params: string[]) => Promise<Dropdowns>,
    className?: string;
    /**
     * Fields to show in the details pane.
     */
    details?: {
        page: string,
        current?: string,
        params?: unknown
    };
    toolbar?: false | WidgetReference[];
    resize?: boolean;
    filter?: Record<string, unknown>;
    params?: Record<string, unknown>;
    index?: object;
    showFilter?: boolean;
    design?: boolean;
    pageSize?: number;
    table?: DataTableProps;
    editors?: Editors;
    view?: DataViewProps;
    cards?: Cards;
    layout?: string;
    layouts?: Layouts;
    methods?: object;
    name?: string;
    hidden?: boolean;
    refresh?: boolean;
    customization?: Customization,
    paramsCard?: string,
    onFieldChange?: string,
    value?: {selected?: unknown[]},
    onChange?: (params: object) => void,
    onCustomization?: (customization: {component: {componentId: string, componentConfig: Customization}}) => Promise<object>;
    fetchValidation?: Joi.Schema;
    clearCurrentAndSelected?: boolean;
}

export type ComponentProps = React.FC<Props>
