import type React from 'react';
import type { JSONSchema7 } from 'json-schema'; // eslint-disable-line
import type { Schema as Validation } from 'joi';
import type { MenuItem } from 'primereact/menuitem';
import type { DataTableProps } from 'primereact/datatable';
import type { DataViewProps } from 'primereact/dataview';
import type { ColumnProps } from 'primereact/column';
import Joi from 'joi';

export type DataTable = Omit<DataTableProps, 'children'>;
export type DataView = Omit<DataViewProps, 'children'>;

export interface PropertyEditor {
    type?:
        'autocomplete' |
        'boolean' |
        'button' |
        'chips' |
        'currency' |
        'date-time' |
        'date' |
        'dropdown' |
        'dropdownTree' |
        'file' |
        'icon' |
        'image' |
        'integer' |
        'label' |
        'mask' |
        'multiSelect' |
        'multiSelectPanel' |
        'multiSelectTree' |
        'multiSelectTreeTable' |
        'number' |
        'password' |
        'radio' |
        'select-table-radio' |
        'select' |
        'selectTable' |
        'submit' |
        'string' |
        'table' |
        'text' |
        'time';
    dropdown?: string;
    parent?: string;
    column?: ColumnProps;
    pivot?: {
        dropdown?: string;
        examples?: object[];
        master?: object;
        join: object
    };
    id?: string,
    compare?: string,
    optionsFilter?: Record<string, unknown>,
    method?: string,
    columns?: string,
    widgets?: string[],
    dataKey?: string,
    change?: Record<string, unknown>,
    [editorProperties: string]: unknown
}

export interface Dropdowns {
    [name: string]: {
        label: string;
        value: unknown;
        className?: string;
        title?: string;
        parent?: unknown;
        disabled?: boolean
    }[] | {
        key: unknown;
        label?: string;
        data?: unknown;
    }[]
}

export interface Editor extends React.FC<{
    name: string,
    Input: React.FC<{name: string, className?: string}>,
    Label: React.FC<{name: string, className?: string}>,
    ErrorLabel: React.FC<{name: string, className?: string}>
}> {
    title?: string,
    widget?: PropertyEditor,
    properties: string[]
}
export interface Editors {
    [name: string]: Editor
}

export interface Property extends JSONSchema7 {
    filter?: boolean;
    sort?: boolean;
    udf?: boolean;
    action?: (action: {
        id: unknown,
        current: object,
        selected: unknown[]
    }) => void;
    body?: string;
    widget?: PropertyEditor,
    properties?: {
        [key: string]: Property
    },
    items?: Property,
    validation?: Validation
}

export interface Properties {
    [name: string]: Property
}

export interface Schema extends JSONSchema7 {
    properties?: {
        [name: string]: Property
    }
}

export interface PropertyEditors {
    [name: string]: Property | Editor
}

export type Selection = {
    id: string | number,
    current: object,
    selected: object[]
}
export type ActionHandler = ((item: Selection) => void) | string | {type: string}

export type WidgetReference = string | {
    name?: string,
    id?: string,
    label?: string,
    title?: string,
    type?: PropertyEditor['type'],
    className?: string,
    fieldClass?: string,
    labelClass?: string,
    permission?: string,
    action?: ActionHandler,
    method?: string,
    params?: object | string,
    selectionPath?: string,
    propertyName?: string,
    actions?: object,
    widgets?: string[],
    hidden?: string[],
    compare?: string,
    filter?: object,
    disabled?: 'current' | 'selected' | 'single' | boolean | Joi.Schema,
    enabled?: 'current' | 'selected' | 'single' | boolean | Joi.Schema
}
export interface Card {
    label?: string;
    widgets?: WidgetReference[];
    watch?: string;
    match?: unknown;
    className?: string;
    type?: 'toolbar' | 'card';
    classes?: {
        [name: string]: {
            root?: string,
            widget?: string,
            field?: string,
            label?: string,
            input?: string
        }
    },
    flex?: string;
    hidden?: boolean;
}

export interface Cards {
    [name: string]: Card
}

interface IndexItem extends MenuItem {
    id?: string;
    items?: IndexItem[];
    widgets?: (string | string[])[];
}

interface IndexItemId extends IndexItem {
    id: string;
}

interface Index extends MenuItem {
    orientation?: 'left' | 'top';
    items?: IndexItem[];
}

export type Layout = (WidgetReference | WidgetReference[])[];

export interface Layouts {
    [name: string]: (string | string[])[] | Index | IndexItemId[] | {
        columns: string,
        params?: (string | string[])[],
        toolbar?: string
    } | {
        layout: Layout,
        toolbar?: string
    }
}

export interface Action {
    title: string;
    permission?: string;
    enabled?: string | boolean;
    action: ActionHandler;
    params?: object;
}
