import type { JSONSchema7 } from 'json-schema'; // eslint-disable-line
import type { Schema } from 'joi';

export interface PropertyEditor {
    type: 'dropdown' | 'dropdownTree' | 'text' | 'mask' | 'date' | 'time' | 'date-time' | 'boolean' | 'currency' | 'table';
    dropdown?: string;
    parent?: string;
    [editorProperties: string]: any
}
export interface Property extends JSONSchema7 {
    filter?: boolean;
    sort?: boolean;
    action?: ({
        id: any,
        current: {},
        selected: []
    }) => void;
    editor?: PropertyEditor,
    properties?: {
        [key: string]: Property
    },
    validation?: Schema
}

export interface Properties {
    [name: string]: Property
}
export interface Card {
    title?: string;
    properties: string[];
    className?: string;
    flex?: string;
}

export interface Cards {
    [name: string]: Card
}

export interface Dropdowns {
    [name: string]: {
        label: string;
        value: any;
        className?: string;
        title?: string;
        disabled?: boolean
    }[]
}
