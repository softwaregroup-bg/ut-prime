#!/usr/bin/env node
// enable running jest when project is cloned in subfolder of node_modules
const Runtime = require('jest-runtime').default; // eslint-disable-line

const origCreateHasteMap = Runtime.createHasteMap;

Runtime.createHasteMap = function(...args) {
    const ret = origCreateHasteMap.call(this, ...args);
    ret._options.retainAllFiles = true;
    return ret;
};

module.exports = require('jest-cli/bin/jest');
