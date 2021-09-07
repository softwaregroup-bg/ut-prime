import React from 'react';

export interface Props {
    permission: string | string[];
}

export type StyledType = React.FC<Props>
