import React from 'react';
import type { PortalConfiguration } from '../Text/context';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    loginPage?: string;
    cookieCheck?: ({ appId }) => { result?: object; error?: object };
    corePortalGet?: (params: {
        languageId: string | number;
        dictName: string[];
    }) => Promise<{ result?: { translations?: []; configuration?: PortalConfiguration } }>;
}

export type ComponentProps = React.FC<Props>;
