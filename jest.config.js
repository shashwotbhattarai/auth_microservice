module.exports = {
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  coverageReporters: ["lcov", "text"],
  collectCoverage: true,
  collectCoverageFrom: ["src/services/*.ts", "src/middlewares/*.ts"],
};
