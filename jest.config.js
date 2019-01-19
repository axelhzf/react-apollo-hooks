module.exports = {
  verbose: false,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  "testMatch": [
    "<rootDir>/src/**/?(*.)(test).{ts,tsx}"
  ],
};