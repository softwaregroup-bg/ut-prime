import React from 'react';

export type asyncComponentParams = {}
export type asyncComponent = (params: asyncComponentParams) => Promise<React.FC>

export interface Props {
    params?: asyncComponentParams,
    search?: string,
    component: asyncComponent
};

export type StyledType = React.FC<Props>
