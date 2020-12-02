module.exports = (componentName) => ({
    content: `import { HTMLAttributes } from 'react';

export interface I${componentName}Props extends HTMLAttributes<HTMLButtonElement> {
    className?: string;
}
`,
    extension: '.types.ts',
});
