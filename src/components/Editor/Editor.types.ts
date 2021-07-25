import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';
import type { Schema } from 'joi';
import type { JSONSchema7 } from 'json-schema'; // eslint-disable-line

export interface PropertyEditor {
    type: 'dropdown' | 'dropdownTree' | 'text' | 'mask' | 'date' | 'boolean' | 'currency' | 'table';
    dropdown?: string;
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
interface Card {
    title: string;
    properties: string[];
    className?: string;
}

interface Cards {
    [name: string]: Card
}

export interface Props extends React.HTMLAttributes<HTMLFormElement> {
    className?: string;
    properties: Properties;
    cards: Cards;
    dropdown?: {
        [name: string]: {
            label: string;
            value: any;
            className?: string;
            title?: string;
            disabled?: boolean
        }[]
    },
    layout?: string[];
    onSubmit: (form: {}) => void;
    trigger?: {
        current: (event: {}) => void
    };
    value?: any;
}

const styles = createStyles({
    component: {
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
