import React from 'react';
import type { GMapOptions } from '../prime/googlemap/GMap.types';

interface PortalConfiguration {
    'utPrime.GMap'?: GMapOptions
}

interface contextType {
    language?: string;
    languageCode?: string;
    translate?: (id: string, text:string, language: string) => string,
    configuration?: PortalConfiguration
}
const defaultContext: contextType = {};
export default React.createContext(defaultContext);
