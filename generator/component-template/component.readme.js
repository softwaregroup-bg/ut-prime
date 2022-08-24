module.exports = (componentName) => ({
    content: `# ${componentName}
import { Canvas, Story, ArgsTable } from "@storybook/addon-docs";
import {Input, Table} from "./${componentName}.stories";

## Importing

\`\`\`jsx
import ${componentName} from 'ut-prime/core/${componentName}';

<${componentName} className='name' />;
\`\`\`

## Basic Usage

<Canvas>
    <Story id="${componentName.toLowerCase()}--basic" />
</Canvas>

## Properties

<ArgsTable story="."/>
`,
    fileName: 'README',
    extension: '.mdx'
});
