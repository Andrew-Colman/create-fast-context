/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */

require('jsonc-require');
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['/node_modules/', '/src/data', 'test-utils.tsx'],
    rootDir: './src',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: '<rootDir>/',
    }),
    transform: {
        '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    setupFilesAfterEnv: ['<rootDir>/../jest.setup.js'],
};
