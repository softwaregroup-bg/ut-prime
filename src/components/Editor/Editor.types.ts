import React from 'react';

import type {Schema, Editors, Cards, Dropdowns, Layouts} from '../types';
export interface Props {
    object?: string,
    id?: string | number,
    init?: object,
    schema?: Schema,
    schemaCreate?: Schema,
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
    methods?: {
        [key: string]: (params: object) => Promise<void>
    },
    onDropdown?: (params: string[]) => Promise<Dropdowns>,
    onInit?: (params: object) => Promise<object>,
    onAdd?: (params: object) => Promise<object>,
    onGet?: (params: object) => Promise<object>,
    onEdit?: (params: object) => Promise<object>
}

export type ComponentProps = React.FC<Props>
