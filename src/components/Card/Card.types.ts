import React from 'react';

import type {Cards, Dropdowns, WidgetReference} from '../types';
import useForm from '../hooks/useForm';
import useLayout from '../hooks/useLayout';

export interface Props {
    cardName: WidgetReference,
    index1?: number,
    index2?: number | boolean,
    cards: Cards,
    dropdowns?: Dropdowns,
    methods: object,
    loading?: string,
    design?: boolean,
    layoutState: ReturnType<typeof useLayout>,
    formApi?: ReturnType<typeof useForm>,
    value?: object,
    inspected?: string;
    onInspect?: (data: object) => void;
    move?: (
        type: 'card' | 'field',
        source: object,
        destination: object
    ) => void,
    toolbar?: boolean,
    classNames?: object
}

export type ComponentProps = React.FC<Props>
