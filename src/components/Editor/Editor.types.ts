import React from 'react';

import type {Schema, Editors, Cards, Dropdowns, Layouts} from '../types';

interface Customization {
    schema?: Schema,
    card?: Cards,
    layout?: Layouts
}
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
    customization?: Customization,
    onCustomization?: (customization: {component: {componentId: string, componentConfig: Customization}}) => Promise<object>,
    debug?: boolean,
    layoutName?: string,
    nested?: string[],
    keyField?: string,
    resultSet?: string,
    design?: boolean,
    toolbar?: boolean,
    noScroll?: boolean,
    value?: object,
    loading?: string,
    methods?: {
        [key: string]: (params: object) => Promise<Record<string, unknown>>
    },
    onDropdown?: (params: string[]) => Promise<Dropdowns>,
    onInit?: (params: object) => Promise<object>,
    onAdd?: (params: object) => Promise<object>,
    onGet?: (params: object) => Promise<object>,
    onEdit?: (params: object) => Promise<object>,
    onChange?: (params: object) => void
}

export type ComponentProps = React.FC<Props>
