/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  setupFilesAfterEnv: ["./src/__tests__/setup.js"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  clearMocks: true,
  resetMocks: false, // Don't reset mocks between tests
  resetModules: false, // Don't reset modules between tests
  testTimeout: 30000, // 30 second timeout for API calls
};
