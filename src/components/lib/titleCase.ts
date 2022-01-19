export default (camelCase: string) => camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, match => match.toUpperCase())
    .trim()
    .replace(/ Id$/, '');
