import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';
import type { Schema } from 'joi';

interface Field {
    title: string;
    editor?: {
        type: string
    },
    validation?: Schema
}

interface Fields {
    [name: string]: Field
}
interface Card {
    title: string;
    fields: string[];
    className?: string;
}

interface Cards {
    [name: string]: Card
}

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    fields: Fields;
    cards: Cards;
    onSubmit: (form: {}) => void;
    trigger: {
        current: (event: {}) => void
    };
    get: (params?: {}) => Promise<{}>;
}

const styles = createStyles({
    component: {
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
