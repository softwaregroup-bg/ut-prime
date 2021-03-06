import React from 'react';

export type asyncComponentParams = object
export type asyncComponent = (params: asyncComponentParams) => Promise<React.FC>

export interface Props {
    params?: asyncComponentParams,
    search?: string,
    component: asyncComponent
}

export type ComponentProps = React.FC<Props>
