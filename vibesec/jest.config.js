module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/',
    'next/navigation': '<rootDir>/src/__mocks__/next/navigation.js',
    '@clerk/nextjs': '<rootDir>/src/__mocks__/@clerk/nextjs.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
};
