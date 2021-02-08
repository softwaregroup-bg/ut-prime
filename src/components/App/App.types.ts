import {ThemeOptions} from '@material-ui/core/styles';
import React from 'react';
import {Store} from 'redux';

import {menuItem, showTab} from '../Context';

export interface utTheme extends ThemeOptions {
    ut: {
        classes: {}
    }
}

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    menu: menuItem[],
    showTab: showTab,
    theme: utTheme,
    portalName: string,
    store: Store
}

export type StyledType = React.FC<Props>
