import React from 'react';
import type { GMapOptions } from '../prime/googlemap/GMap.types';
import type { FormatOptions } from '../Gate/Gate.types';

export interface PortalConfiguration {
    'portal.utPrime.GMap'?: string | GMapOptions;
    'portal.utPrime.formatOptions'?: string | FormatOptions;
}

export interface ContextType {
    language?: string;
    languageCode?: string;
    joiMessages?: Record<string, string>,
    translate?: (id: string, text?: string, language?: string) => string;
    configuration?: PortalConfiguration;
    getScale?: (currency: number | string) => number;
    formatValue?: (value: number | Date, options: object) => string;
}
const defaultContext: ContextType = {};
export default React.createContext(defaultContext);
