import React from 'react';
import type { JSONSchema7 } from 'json-schema'; // eslint-disable-line
import type { Schema } from 'joi';

export interface PropertyEditor {
    type: 'dropdown' | 'dropdownTree' | 'text' | 'mask' | 'date' | 'time' | 'date-time' | 'boolean' | 'currency' | 'table' | 'multiSelect' | 'multiSelectPanel' | 'select';
    dropdown?: string;
    parent?: string;
    [editorProperties: string]: any
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

export interface Editor extends React.FC<{
    name: string,
    Input: React.FC<{name: string, className?: string}>,
    Label: React.FC<{name: string, className?: string}>,
    ErrorLabel: React.FC<{name: string, className?: string}>
}> {
    title?: string,
    editor?: {
        parent?: string;
        filter?: {}
    },
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

export interface PropertyEditors {
    [name: string]: Property | Editor
}
export interface Card {
    title?: string;
    properties: string[];
    className?: string;
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
