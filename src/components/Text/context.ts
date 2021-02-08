import React from 'react';

interface contextType {
    language?: string;
    translate?: (text:string, language: string) => string
}
const defaultContext: contextType = {};
export default React.createContext(defaultContext);
