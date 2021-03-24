import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';

export interface Props {
    keyField: string;
    field: string;
    title: string;
    resultSet: string;
    fetch: (params: {}) => Promise<{}>;
    className?: string;
    parentField?: string;
}

const styles = createStyles({
    component: {
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
