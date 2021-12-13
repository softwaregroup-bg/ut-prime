import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    loginPage?: string,
    cookieCheck?: ({appId: string}) => {result?: {}, error?: {}};
    fetchTranslations?: (params: {languageId: number, dictName: string[]}) => Promise<any>;
}

const styles = createStyles({
    component: {
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
