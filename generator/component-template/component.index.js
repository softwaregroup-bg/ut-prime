module.exports = (componentName) => ({
    content: `import React from 'react';
import clsx from 'clsx';
import {createUseStyles} from 'react-jss';
import type {ComponentProps} from './${componentName}.types';

const useStyles = createUseStyles({
    ${componentName.toLowerCase()}: {
    }
});

const ${componentName}: ComponentProps = ({
    className,
    ...rest
}) => {
    const classes = useStyles();
    return <div
        className={clsx(classes.${componentName.toLowerCase()}, className)}
        {...rest}
    />;
};

export default ${componentName};
`,
    fileName: 'index',
    extension: '.tsx'
});
