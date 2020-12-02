/* eslint-disable no-process-exit */
/* eslint-disable no-console */

require('colors');
const fs = require('fs');
const templates = require('./component-template');

const componentName = process.argv[2];

if (!componentName) {
    console.error('Please supply a valid component name'.red);
    process.exit(1);
}

console.log('Creating Component Templates with name: ' + componentName);

const componentDirectory = `./src/components/${componentName}`;

if (fs.existsSync(componentDirectory)) {
    console.error(`Component ${componentName} already exists.`.red);
    process.exit(1);
}

fs.mkdirSync(componentDirectory);

const generatedTemplates = templates.map((template) => template(componentName));

generatedTemplates.forEach((template) => {
    const fileName = template.fileName ? template.fileName : componentName;
    fs.writeFileSync(`${componentDirectory}/${fileName}${template.extension}`, template.content);
});

console.log('Successfully created component under: ' + componentDirectory.green);
