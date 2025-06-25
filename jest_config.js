module.exports = {
  testEnvironment: "node",
  collectCoverageFrom: ["index.js", "!node_modules/**"],
  coverageReporters: ["text", "lcov", "html"],
  testMatch: ["<rootDir>/test/*.test.js"],
  testPathIgnorePatterns: ["/node_modules/", "/test-esm/", ".*\\.mjs$"],
  moduleFileExtensions: ["js"],
  transform: {},
};
