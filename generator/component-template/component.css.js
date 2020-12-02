module.exports = (componentName) => ({
    content: `.${componentName} {
  background-color: red;
  color: white;
  padding: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}    
`,
    extension: '.css',
});
