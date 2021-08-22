import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';

import type {Properties, Cards, Dropdowns} from '../types';

export interface Props {
    object: string,
    id?: any,
    properties: Properties,
    type?: string,
    typeField?: string,
    cards: Cards,
    layouts?: {
        [name: string]: (string | string[])[]
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
