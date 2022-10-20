import React from 'react';
import type { MenuItem } from 'primereact/menuitem';

interface Item extends MenuItem {
    id?: string;
    filter?: string | string[] | RegExp
}

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    name?: string;
    items: Item[];
    orientation?: 'left' | 'top',
    type?: 'steps' | 'tabs' | 'thumbs',
    loading?: boolean,
    trigger?: React.MouseEventHandler,
    onFilter: (filter: unknown) => void
}

export type ComponentProps = React.FC<Props>
