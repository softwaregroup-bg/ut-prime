import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';
import type { Schema } from 'joi';

import {Properties, Editors, Cards, Dropdowns} from '../types';
export interface Props extends React.HTMLAttributes<HTMLFormElement> {
    className?: string;
    properties: Properties;
    editors?: Editors;
    cards: Cards;
    dropdowns?: Dropdowns,
    layout?: (string | string[])[];
    loading?: string;
    validation?: Schema;
    design?: boolean;
    onSubmit: (form: {}) => void;
    setTrigger?: (trigger: (event: {}) => void) => void;
    value?: any;
}

const styles = createStyles({
    component: {
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
