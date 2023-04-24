import React from 'react';
import type { MenuItem } from 'primereact/menuitem';
import type { UseFormReturn } from 'react-hook-form';
import useLayout from '../hooks/useLayout';

interface Item extends MenuItem {
    id?: string;
    filter?: string | string[] | RegExp
}

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    name?: string;
    items: Item[];
    layoutState?: ReturnType<typeof useLayout>,
    orientation?: 'left' | 'top';
    type?: 'steps' | 'tabs' | 'thumbs';
    loading?: boolean;
    trigger?: React.MouseEventHandler;
    onFilter: (filter: unknown) => void;
    validate?: (selectedList: object) => {error?: object, values: object};
    disableBack?: boolean;
    hideBack?: boolean;
    methods?: object;
    formApi?: UseFormReturn
}

export type ComponentProps = React.FC<Props>
