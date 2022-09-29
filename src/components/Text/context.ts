import React from 'react';

interface contextType {
    language?: string;
    translate?: (id: string, text:string, language: string) => string
}
const defaultContext: contextType = {};
export default React.createContext(defaultContext);
