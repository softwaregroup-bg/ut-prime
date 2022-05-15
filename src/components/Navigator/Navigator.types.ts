import {createUseStyles} from 'react-jss';
import React from 'react';

export interface Props {
    /**
     * Name of the key field in the result set.
     */
    keyField: string;
    /**
     * Name of the field to show.
     */
    field: string;
    /**
     * Title to show.
     */
    title: string;
    /**
     * Name of the property, in which the result set is returned.
     */
    resultSet: string;
    /**
     * Data fetching async function.
     */
    fetch: (params: {}) => Promise<{}>;
    className?: string;
    /**
     * Name of the field, which defines the parent-child relation in the hierarchy
     */
    parentField?: string;
    onSelect?: (key: any) => void;
}

export const useStyles = createUseStyles({
});

export type ComponentProps = React.FC<Props>
