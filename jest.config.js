const notUt = '/node_modules/(?!(impl|ut|lodash)-)';
module.exports = {
    roots: ['./src'],
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.stories.tsx'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['lcov', 'cobertura', 'text'],
    setupFilesAfterEnv: ['./jest.setup.js'],
    coveragePathIgnorePatterns: ['<rootDir>/node_modules/', notUt],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', notUt],
    transformIgnorePatterns: ['<rootDir>/node_modules/(?!(impl|ut|lodash)-)', notUt],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^.+\\.(css|less|scss|png|ttf)$': 'babel-jest'
    },
    transform: {
        '\\.[jt]sx?$': ['babel-jest', {configFile: require.resolve('./jest.babel.json')}],
        '^.+\\.mdx?$': './stub'
    }
};
