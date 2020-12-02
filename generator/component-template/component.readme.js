module.exports = (componentName) => ({
    content: `# Button

## How to use

\`\`\`jsx
import ${componentName} from 'ut-front-devextreme/core/${componentName}';

<${componentName} onClick={handlerOnClick}>Hello ${componentName}</${componentName}>;
\`\`\`

## Props

- **className** - class applied to root \`${componentName}\` html element.

| propName  | propType | defaultValue | isRequired |
| --------- | -------- | ------------ | ---------- |
| className | string   |              | no         |

`,
    fileName: 'README',
    extension: '.md',
});
