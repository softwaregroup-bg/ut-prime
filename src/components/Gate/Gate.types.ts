import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    loginPage?: string,
    cookieCheck?: ({appId}) => {result?: object, error?: object};
    corePortalGet?: (params: {languageId: string | number, dictName: string[]}) => Promise<{result?: {translations?: [], configuration?: object}}>;
}

export type ComponentProps = React.FC<Props>
