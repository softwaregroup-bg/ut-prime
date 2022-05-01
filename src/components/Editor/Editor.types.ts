import {createUseStyles} from 'react-jss';
import React from 'react';

import type {Schema, Editors, Cards, Dropdowns, Layouts} from '../types';
export interface Props {
    object?: string,
    id?: any,
    schema?: Schema,
    editors?: Editors,
    type?: string,
    name?: string,
    typeField?: string,
    cards: Cards,
    layouts?: Layouts,
    debug?: boolean,
    layoutName?: string,
    nested?: string[],
    keyField?: string,
    resultSet?: string,
    design?: boolean,
    methods?: any,
    onDropdown?: (params: string[]) => Promise<Dropdowns>,
    onAdd?: (params: {}) => Promise<{}>,
    onGet?: (params: {}) => Promise<{}>,
    onEdit?: (params: {}) => Promise<{}>
}

export const useStyles = createUseStyles({
});

export type ComponentProps = React.FC<Props>
