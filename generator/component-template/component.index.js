module.exports = (componentName) => ({
    content: `import React from 'react';
import clsx from 'clsx';

import { Styled, StyledType } from './${componentName}.types';

const ${componentName}: StyledType = ({ classes, className, ...rest }) => {
    return <div
        className={clsx(classes.component, className)}
        {...rest}
    />;
};

export default Styled(${componentName});
`,
    fileName: 'index',
    extension: '.tsx'
});
