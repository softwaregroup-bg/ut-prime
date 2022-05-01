module.exports = (componentName) => ({
    content: `import React from 'react';
import clsx from 'clsx';

import { useStyles, ComponentProps } from './${componentName}.types';

const ${componentName}: ComponentProps = ({ className, ...rest }) => {
    const classes = useStyles();
    return <div
        className={clsx(classes.component, className)}
        {...rest}
    />;
};

export default ${componentName};
`,
    fileName: 'index',
    extension: '.tsx'
});
