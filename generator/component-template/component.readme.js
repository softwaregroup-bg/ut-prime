module.exports = (componentName) => ({
    content: `# ${componentName}

## How to use

\`\`\`jsx
import ${componentName} from 'ut-prime/core/${componentName}';

<${componentName} className='name' />;
\`\`\`

## Props

- **className** - class applied to root \`${componentName}\` html element.

| propName  | propType | defaultValue | isRequired |
| --------- | -------- | ------------ | ---------- |
| className | string   |              | no         |
`,
    fileName: 'README',
    extension: '.md'
});
