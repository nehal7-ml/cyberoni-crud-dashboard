/** @type {import('ts-jest').JestConfigWithTsJest} */
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
  testEnvironmentOptions: {
    url: "http://localhost:3001",
  },
});
const config = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // Handle module aliases
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/context/(.*)$": "<rootDir>/context/$1",
    "^@/pages/(.*)$": "<rootDir>/pages/$1",
    "^@/crud/*": "<rootDir>/crud/$1",
    "^@/app/*": "<rootDir>/app$1",
    "^@/lib/*": "<rootDir>/lib$1",
    "^@/styles/*": "<rootDir>/styles$1",
  },
  "coverageReporters": ["text-summary", "html"]  
};
module.exports = createJestConfig(config);
