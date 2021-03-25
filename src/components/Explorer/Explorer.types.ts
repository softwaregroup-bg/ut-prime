import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';

interface column {
    dataField: string;
    caption: string;
}

export interface Props {
    keyField: string;
    resultSet?: string;
    fields: column[];
    fetch: (params: {}) => Promise<{}>;
    className?: string;
    details: {};
}

const styles = createStyles({
    details: {
        marginBottom: 15
    },
    detailsLabel: {},
    detailsValue: {}
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
