import type {Properties} from 'csstype'; // eslint-disable-line
import {Theme} from '@material-ui/core/styles';
import React from 'react';
import { Props as StoreProps } from '../Store/Store.types';

export interface utTheme extends Theme {
    ut: {
        classes?: {},
        headerLogo?: Properties,
        loginTop?: Properties,
        loginBottom?: Properties
    }
}

export interface Props extends StoreProps, React.HTMLAttributes<HTMLDivElement> {
    theme: utTheme,
    portalName: string,
    loginPage?: string
}

export type StyledType = React.FC<Props>
