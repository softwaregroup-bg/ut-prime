module.exports = {
    roots: ['./src'],
    setupFilesAfterEnv: ['./jest.setup.js'],
    moduleNameMapper: {
        '^.+\\.(css|less|scss)$': 'babel-jest',
    },
};
