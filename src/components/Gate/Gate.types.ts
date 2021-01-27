import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    cookieChecked: boolean;
    gateLoaded: boolean;
    isLogout: boolean;
    authenticated: boolean;
    result: any;
    logout: () => void;
    cookieCheck: ({appId: string}) => void;
    fetchTranslations: (params: {languageId: number, dictName: string[]}) => Promise<any>;
}

const styles = createStyles({
    gate: {
        height: '100%'
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
