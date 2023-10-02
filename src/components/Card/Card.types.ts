import React from 'react';

import type {Cards, Dropdowns, WidgetReference, Allow} from '../types';
import useForm from '../hooks/useForm';
import useLayout from '../hooks/useLayout';

export interface Props {
    cardName: WidgetReference,
    index1?: number,
    last1?: number,
    index2?: number | boolean,
    last2?: number | boolean,
    cards: Cards,
    dropdowns?: Dropdowns,
    methods: object,
    loading?: string,
    disabled?: Allow;
    enabled?: Allow;
    design?: boolean,
    layoutState: ReturnType<typeof useLayout>,
    formApi?: ReturnType<typeof useForm>,
    value?: object,
    inspected?: string;
    onInspect?: (data: object) => void;
    onFieldChange: string;
    submit?: (event: object) => void;
    move?: (
        type: 'card' | 'field',
        source: object,
        destination: object
    ) => void,
    toolbar?: boolean,
    classNames?: object,
    isPropertyRequired?: (propertyName: string) => boolean
}

export type ComponentProps = React.FC<Props>
