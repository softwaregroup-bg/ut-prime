import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    loginPage?: string,
    cookieCheck?: ({appId}) => {result?: object, error?: object};
    fetchTranslations?: (params: {languageId: string | number, dictName: string[]}) => Promise<{result?: {translations?: []}}>;
}

export type ComponentProps = React.FC<Props>
