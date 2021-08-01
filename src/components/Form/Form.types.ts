import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';
import type { Schema } from 'joi';
import type { JSONSchema7 } from 'json-schema'; // eslint-disable-line

export interface PropertyEditor {
    type: 'dropdown' | 'dropdownTree' | 'text' | 'mask' | 'date' | 'boolean' | 'currency' | 'table';
    dropdown?: string;
    parent?: string;
    [editorProperties: string]: any
}
export interface Property extends JSONSchema7 {
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

export interface Props extends React.HTMLAttributes<HTMLFormElement> {
    className?: string;
    properties: Properties;
    cards: Cards;
    dropdowns?: Dropdowns,
    layout?: string[];
    validation?: Schema;
    onSubmit: (form: {}) => void;
    setTrigger?: (trigger: (event: {}) => void) => void;
    value?: any;
}

const styles = createStyles({
    component: {
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
