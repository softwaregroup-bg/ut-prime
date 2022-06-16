import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    loginPage?: string,
    cookieCheck?: ({appId: string}) => {result?: object, error?: object};
    fetchTranslations?: (params: {languageId: string | number, dictName: string[]}) => Promise<any>;
}

export type ComponentProps = React.FC<Props>
