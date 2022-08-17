module.exports = () => ({
    content: `import React from 'react';

export interface Props {
    className?: string;
}

export type ComponentProps = React.FC<Props>
`,
    extension: '.types.ts'
});
