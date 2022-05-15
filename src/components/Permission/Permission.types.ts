import React from 'react';

export interface Props {
    /**
     * Permission(s) to check
     */
    permission: string | string[];
}

export type ComponentProps = React.FC<Props>
