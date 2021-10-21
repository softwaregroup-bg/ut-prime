import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';

import type {Schema, Editors, Cards, Dropdowns, Layouts} from '../types';
export interface Props {
    object: string,
    id?: any,
    schema: Schema,
    editors?: Editors,
    type?: string,
    typeField?: string,
    cards: Cards,
    layouts?: Layouts,
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
