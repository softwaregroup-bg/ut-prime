import React from 'react';

import type {Cards, Dropdowns} from '../types';
import useForm from '../hooks/useForm';
import useLayout from '../hooks/useLayout';

export interface Props {
    cardName: string | {name: string},
    index1?: number,
    index2?: number | boolean,
    cards: Cards,
    dropdowns?: Dropdowns,
    methods: object,
    loading?: string,
    design?: boolean,
    layoutState: ReturnType<typeof useLayout>,
    formApi?: ReturnType<typeof useForm>
}

export type ComponentProps = React.FC<Props>
