module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.ts", "**/tests/**/*.test.js"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverageFrom: [
        "src/**/*.{js,ts}",
        "lib/**/*.js",
        "!**/node_modules/**",
        "!**/dist/**"
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    coverageReporters: ["text", "lcov", "clover", "html"]
};
