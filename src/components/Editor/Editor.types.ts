import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';
import type { Schema } from 'joi';

interface Fields {
    name: string;
    title: string;
    card: string;
    editor?: {
        type: string
    }
}

interface Cards {
    id: string;
    title: string;
}

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    fields: Fields[];
    cards: Cards[];
    schema?: Schema;
    onSubmit: (form: {}) => void;
}

const styles = createStyles({
    component: {
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
