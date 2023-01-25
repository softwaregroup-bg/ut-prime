import React from 'react';
import type { PortalConfiguration } from '../Text/context';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    loginPage?: string;
    cookieCheck?: ({ appId }) => Promise<{ result?: {language?: {iso2Code: string}}; error?: object }>;
    corePortalGet?: (params: {
        languageId: string | number;
        dictName: string[];
    }) => Promise<{ result?: { translations?: []; configuration?: PortalConfiguration, currencies?: [] } }>;
}

export type ComponentProps = React.FC<Props>;
