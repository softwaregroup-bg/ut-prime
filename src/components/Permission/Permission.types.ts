import React from 'react';

export interface Props {
    permission: string | string[];
}

export type ComponentProps = React.FC<Props>
