import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';

import type { MenuItem } from 'primereact/menuitem/MenuItem';
import type {Properties, Cards, Dropdowns} from '../types';

interface Index extends MenuItem {
    orientation?: 'left' | 'top',
    index: MenuItem
}
export interface Props {
    object: string,
    id?: any,
    properties: Properties,
    type?: string,
    typeField?: string,
    cards: Cards,
    layouts?: {
        [name: string]: (string | string[])[] | Index
    },
    layoutName?: string,
    nested?: string[],
    keyField?: string,
    resultSet?: string,
    design?: boolean,
    onDropdown: (params: string[]) => Promise<Dropdowns>,
    onAdd: (params: {}) => Promise<{}>,
    onGet: (params: {}) => Promise<{}>,
    onEdit: (params: {}) => Promise<{}>
}

const styles = createStyles({
    component: {
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
