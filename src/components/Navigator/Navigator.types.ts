import {createUseStyles} from 'react-jss';
import React from 'react';

export interface Props {
    keyField: string;
    field: string;
    title: string;
    resultSet: string;
    fetch: (params: {}) => Promise<{}>;
    className?: string;
    parentField?: string;
    onSelect?: (key: any) => void;
}

export const useStyles = createUseStyles({
});

export type ComponentProps = React.FC<Props>
