import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';
import { MenuItem } from 'primereact/components/menuitem/MenuItem';

interface Item extends MenuItem {
    filter?: string | string[] | RegExp
}

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    index: Item[];
    onFilter: (filter: string[]) => void
}

const styles = createStyles({
    component: {
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
