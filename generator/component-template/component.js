module.exports = (componentName) => ({
    content: `import React from 'react';
import classnames from 'classnames';

import { I${componentName}Props } from './${componentName}.types';
import './${componentName}.css';

const ${componentName}: React.FC<I${componentName}Props> = ({ className, ...rest }) => {
    return <button className={classnames('${componentName}', className)} {...rest} />;
};

export default ${componentName};
`,
    extension: '.tsx'
});
