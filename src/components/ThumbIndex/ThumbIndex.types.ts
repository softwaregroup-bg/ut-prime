import {createUseStyles} from 'react-jss';
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
    onFilter: (filter: any) => void
}

export const useStyles = createUseStyles({
});

export type ComponentProps = React.FC<Props>
