import React from 'react';
import type { GMapOptions } from '../prime/googlemap/GMap.types';

export interface PortalConfiguration {
    'portal.utPrime.GMap'?: string | GMapOptions;
}

export interface ContextType {
    language?: string;
    languageCode?: string;
    translate?: (id: string, text: string, language: string) => string;
    configuration?: PortalConfiguration;
    getScale?: (currency: number | string) => number;
    formatValue?: (value: number | Date, options: object) => string;
}
const defaultContext: ContextType = {};
export default React.createContext(defaultContext);
