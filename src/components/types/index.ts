import type React from 'react';
import type { JSONSchema7 } from 'json-schema'; // eslint-disable-line
import type { Schema as Validation } from 'joi';
import type { MenuItem } from 'primereact/menuitem';
import type { DataTableProps } from 'primereact/datatable';
import type { ColumnProps } from 'primereact/column';

export type DataTable = Omit<DataTableProps, 'children'>;

export interface PropertyEditor {
    type?:
        'string' |
        'autocomplete' |
        'boolean' |
        'button' |
        'date-time' |
        'date' |
        'dropdown' |
        'dropdownTree' |
        'file' |
        'integer' |
        'number' |
        'image' |
        'mask' |
        'multiSelect' |
        'multiSelectPanel' |
        'multiSelectTree' |
        'multiSelectTreeTable' |
        'password' |
        'radio' |
        'select-table-radio' |
        'select' |
        'selectTable' |
        'currency' |
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
    [editorProperties: string]: any
}

export interface Dropdowns {
    [name: string]: {
        label: string;
        value: any;
        className?: string;
        title?: string;
        parent?: any;
        disabled?: boolean
    }[] | {
        key: any;
        label?: string;
        data?: any
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
    action?: ({
        id: any,
        current: object,
        selected: array
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

export type WidgetReference = string | {
    name?: string,
    id?: string,
    label?: string,
    type?: PropertyEditor['type'],
    className?: string,
    permission?: string,
    action?: string,
    params?: object,
    selectionPath?: string,
    propertyName?: string,
    actions?: object,
    widgets?: string[],
    hidden?: string[],
    compare?: string,
    filter?: object,
    disabled?: boolean
}
export interface Card {
    label?: string;
    widgets?: WidgetReference[];
    watch?: string;
    match?: any;
    className?: string;
    type?: 'toolbar' | 'card';
    classes?: {
        [name: string]: {
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
export interface Layouts {
    [name: string]: (string | string[])[] | Index | IndexItemId[]
}

export interface Action {
    title: string;
    permission?: string;
    enabled?: string | boolean;
    action: ({
        id: any,
        current: object,
        selected: array
    }) => void | string;
    params?: object;
}
