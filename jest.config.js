module.exports = {
    roots: ['./src'],
    setupFilesAfterEnv: ['./jest.setup.js'],
    coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/'],
    moduleNameMapper: {
        '^.+\\.(css|less|scss)$': 'babel-jest'
    }
};
