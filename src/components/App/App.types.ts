import {ThemeOptions} from '@material-ui/core/styles';
import React from 'react';
import { Props as StoreProps } from '../Store/Store.types';

export interface utTheme extends ThemeOptions {
    ut: {
        classes: {}
    }
}

export interface Props extends StoreProps, React.HTMLAttributes<HTMLDivElement> {
    theme: utTheme,
    portalName: string
}

export type StyledType = React.FC<Props>
