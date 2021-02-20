import React from 'react';

import {asyncComponent} from '../Async/Async.types';

export type tabs = {
    component: asyncComponent,
    path: string
}[]

export interface Props {
    tabs: tabs
}

export type StyledType = React.FC<Props>
