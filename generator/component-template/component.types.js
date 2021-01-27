module.exports = () => ({
    content: `import {WithStyles, withStyles, createStyles} from '@material-ui/core/styles';
import React from 'react';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const styles = createStyles({
    component: {
        backgroundColor: 'red',
        color: 'white',
        padding: 8,
        border: 'none',
        cursor: 'pointer',
        fontWeight: 500
    }
});

export const Styled = withStyles(styles);
export type StyledType = React.FC<Props & WithStyles<typeof styles>>
`,
    extension: '.types.ts'
});
