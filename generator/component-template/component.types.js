module.exports = () => ({
    content: `import {createUseStyles} from 'react-jss';
import React from 'react';

export interface Props {
    className?: string;
}

export const useStyles = createUseStyles({
    component: {
    }
});

export type ComponentProps = React.FC<Props>
`,
    extension: '.types.ts'
});
