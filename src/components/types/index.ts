import type React from 'react';
import type { JSONSchema7 } from 'json-schema'; // eslint-disable-line
import type { Schema as Validation } from 'joi';
import type { MenuItem } from 'primereact/menuitem';
import type { DataTableProps } from 'primereact/datatable';
import type { DataViewProps } from 'primereact/dataview';
import type { ColumnProps } from 'primereact/column';
import Joi from 'joi';
import useForm from '../hooks/useForm';
import ActionButton from '../ActionButton';

export type DataTable = Omit<DataTableProps, 'children'>;
export type DataView = Omit<DataViewProps, 'children'>;
export type Permission = string | string[] | boolean;
export type Allow = boolean | Joi.Schema | string;

export interface PropertyEditor {
    type?:
        'autocomplete' |
        'boolean' |
        'button' |
        'chips' |
        'currency' |
        'date-time' |
        'date' |
        'dateRange' |
        'dropdown' |
        'dropdownTree' |
        'file' |
        'gps' |
        'icon' |
        'image' |
        'imageUpload' |
        'integer' |
        'jsonView' |
        'json' |
        'label' |
        'mask' |
        'multiSelect' |
        'multiSelectPanel' |
        'multiSelectTree' |
        'multiSelectTreeTable' |
        'number' |
        'ocr' |
        'page' |
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
    parent?: string | string[];
    column?: ColumnProps;
    inlineEdit?: boolean;
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
    page?: string,
    columns?: string | string [] | {name: string, className?: string}[],
    widgets?: (string | {name: string})[],
    dataKey?: string,
    change?: Record<string, unknown>,
    className?: string,
    fieldClass?: string,
    labelClass?: string,
    translation?: boolean,
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
    strip?: boolean;
    mandatory?: boolean;
    udf?: boolean;
    action?: string | ((action: {
        id: unknown,
        current: object,
        selected: unknown[]
    }) => void);
    params?: unknown;
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
    params?: object,
    filter?: object,
    pageSize?: number,
    pageNumber?: number,
    id: string | number,
    current: object,
    selected: object[]
}
export type ActionHandler = ((item: Selection) => void) | string | {type: string}

export interface ActionItem extends MenuItem {
    items?: ActionItem[] | ActionItem[][];
    permission?: Permission;
    enabled?: string | boolean;
    method?: string;
    action?: ActionHandler;
    params?: string | object;
}

export type WidgetReference = string | {
    name?: string,
    id?: string,
    icon?: string,
    label?: string,
    title?: string,
    type?: PropertyEditor['type'],
    dropdown?: string,
    className?: string,
    fieldClass?: string,
    labelClass?: string,
    permission?: Permission,
    confirm?: string,
    action?: ActionHandler,
    method?: string,
    successHint?: React.ReactNode,
    tooltip?: Parameters<typeof ActionButton>[0]['tooltip'],
    tooltipOptions?: Parameters<typeof ActionButton>[0]['tooltipOptions'],
    reactTooltip?: Parameters<typeof ActionButton>[0]['reactTooltip'],
    params?: object | string,
    page?: string,
    selectionPath?: string,
    propertyName?: string,
    inline?: boolean,
    actions?: object,
    menu?: ActionItem[],
    column?: ColumnProps;
    widgets?: WidgetReference[],
    hidden?: string[],
    compare?: string,
    filter?: object,
    parent?: string | string[],
    disabled?: string | boolean | Joi.Schema,
    enabled?: string | boolean | Joi.Schema
}
export interface Card {
    label?: string;
    widgets?: WidgetReference[];
    watch?: string;
    match?: unknown;
    className?: string;
    permission?: Permission;
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
    disabled?: Allow;
    enabled?: Allow;
}

export interface Cards {
    [name: string]: Card
}

interface IndexItem extends MenuItem {
    id?: string;
    items?: IndexItem[];
    widgets?: (string | string[] | MenuItem)[];
    onMount?: string;
    validation?: Joi.Schema | ((value: any) => Joi.ValidationResult);
}

interface IndexItemId extends IndexItem {
    id: string;
}

interface Index extends MenuItem {
    orientation?: 'left' | 'top';
    type?: 'tabs' | 'thumbs' | 'steps';
    items?: IndexItem[];
    disableBack?: boolean;
    hideBack?: boolean;
}

export type Layout = (WidgetReference | WidgetReference[])[];

export interface Layouts {
    [name: string]: (string | string[] | MenuItem)[] | Index | IndexItemId[] | {
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
    permission?: Permission;
    enabled?: string | boolean;
    action: ActionHandler;
    params?: object;
}

export interface UtError extends Error {
    statusCode?: number;
    validation?: {path: string[], message: string}[];
    print?: string;
    silent?: boolean;
    errors?: unknown;
}

export type LayoutMode = 'create' | 'edit' | 'view';

export type FormApi = ReturnType<typeof useForm>;
