import {ThemeOptions} from '@material-ui/core/styles';
import React from 'react';
import {Store} from 'redux';
import {History} from 'history';
export interface utTheme extends ThemeOptions {
    ut: {
        classes: {}
    }
}

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    theme: utTheme,
    portalName: string,
    store: Store,
    history: History
}

export type StyledType = React.FC<Props>
