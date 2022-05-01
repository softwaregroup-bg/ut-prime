import {createUseStyles} from 'react-jss';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    loginPage?: string,
    cookieCheck?: ({appId: string}) => {result?: {}, error?: {}};
    fetchTranslations?: (params: {languageId: string | number, dictName: string[]}) => Promise<any>;
}

export const useStyles = createUseStyles({
});

export type ComponentProps = React.FC<Props>
