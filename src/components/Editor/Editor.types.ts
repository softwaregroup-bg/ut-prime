import React from 'react';

import type {Schema, Editors, Cards, Dropdowns, Layouts} from '../types';
import type {Props as ActionButtonProps} from '../ActionButton/ActionButton.types';

interface Customization {
    schema?: Schema,
    card?: Cards,
    layout?: Layouts
}
export interface Props {
    object?: string,
    id?: string | number,
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
    hidden?: boolean,
    value?: object,
    loading?: string,
    methods?: {
        [key: string]: (params: unknown) => Promise<unknown>
    },
    onDropdown?: (params: string[]) => Promise<Dropdowns>,
    onInit?: (params: object) => Promise<object>,
    onAdd?: (params: object) => Promise<object>,
    onGet?: (params: object) => Promise<object>,
    onEdit?: (params: object) => Promise<object>,
    onFieldChange?: string,
    onLoad?: string,
    onLoaded?: string,
    buttons?: {
        save?: ActionButtonProps | false,
        reset?: ActionButtonProps | false
    }
    onChange?: (params: object) => void
}

export type ComponentProps = React.FC<Props>
