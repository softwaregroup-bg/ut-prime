module.exports = (componentName) => ({
    content: `export { default } from './${componentName}';
`,
    fileName: 'index',
    extension: '.ts'
});
