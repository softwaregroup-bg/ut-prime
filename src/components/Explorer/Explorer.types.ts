import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';

interface column {
    field: string;
    title: string;
    filter?: boolean;
    sort?: boolean;
    action?: ({
        id: any,
        current: {},
        selected: []
    }) => void;
}

interface action {
    title: string;
    permission?: string;
    enabled?: string | boolean;
    action: ({
        id: any,
        current: {},
        selected: []
    }) => void;
}

export interface Props {
    keyField: string;
    resultSet?: string;
    fields: column[];
    fetch: (params: {
        [resultSet: string]: {},
        orderBy: {
            field: string,
            dir: string
        }[],
        paging: {
            pageSize: number,
            pageNumber: number
        }
    }) => Promise<{
        pagination?: {
            recordsTotal: number
        }
    }>;
    className?: string;
    details: {};
    actions?: action[];
    filter?: {};
    pageSize?: number
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
