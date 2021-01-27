import React from 'react';

export interface Props {
    addTab: (pathname: string, title: React.ReactElement, isMain: boolean, pagename: string, shouldUpdate: boolean) => void,
    onUnmount: () => void,
    title: string,
    pathname: string,
    pagename: string,
    shouldUpdate: boolean
}

export type StyledType = React.FC<Props>
