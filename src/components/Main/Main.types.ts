import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    routes: React.ReactNodeArray
}

export type StyledType = React.FC<Props>
