import React from 'react';
import type { GMapOptions } from '../prime/googlemap/GMap.types';

export interface PortalConfiguration {
    'portal.utPrime.GMap'?: string | GMapOptions;
}

interface contextType {
    language?: string;
    languageCode?: string;
    translate?: (id: string, text: string, language: string) => string;
    configuration?: PortalConfiguration;
}
const defaultContext: contextType = {};
export default React.createContext(defaultContext);
