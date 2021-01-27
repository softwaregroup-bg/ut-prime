module.exports = {
    roots: ['./src'],
    setupFilesAfterEnv: ['./jest.setup.js'],
    coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '/node_modules/(?!(impl|ut)-)'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '/node_modules/(?!(impl|ut)-)'],
    transformIgnorePatterns: ['<rootDir>/node_modules/', '/node_modules/(?!(impl|ut)-)'],
    moduleNameMapper: {
        '^.+\\.(css|less|scss|png)$': 'babel-jest'
    }
};
