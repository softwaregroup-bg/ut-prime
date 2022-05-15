module.exports = (componentName) => ({
    content: `# ${componentName}

## How to use

\`\`\`jsx
import ${componentName} from 'ut-prime/core/${componentName}';

<${componentName} className='name' />;
\`\`\`

<Canvas>
    <Story id="${componentName.toLowerCase()}--basic" />
</Canvas>

## Properties

<ArgsTable story="."/>
`,
    fileName: 'README',
    extension: '.mdx'
});
