import React from 'react';

export interface Props {
    /**
     * Permission(s) to check
     */
    permission: string | string[] | boolean;
}

export type ComponentProps = React.FC<Props>
