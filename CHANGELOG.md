# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.2.1] - 2025-07-30

### Added
- Enhanced documentation with more real-world examples and interactive demos
- Visualization components for displaying fiscal calendars in web applications
  - Calendar grid view component
  - Timeline chart component
  - Customizable theming system with predefined themes
- Framework integration examples for React, Vue, and Angular
- Export functionality for fiscal calendars to CSV, iCal, and JSON formats
- Localization support for different languages and regional date formatting
- Advanced reporting and comparison tools for fiscal periods
- UI theming system with predefined themes and customization options
- Additional fiscal year presets for various industries and countries
- Date utilities for working with fiscal periods in different formats

### Changed
- Improved TypeScript type definitions for better developer experience
- Enhanced documentation with more comprehensive examples
- Restructured project for better organization and maintainability
- Optimized performance for large fiscal calendar operations

### Fixed
- Edge cases in date calculations for special calendar systems
- Localization issues with certain date formats
- Type compatibility issues in TypeScript definitions

## [2.0.0] - 2025-07-02

### Added
- TypeScript support with full type definitions
- Special calendar systems (4-4-5, 4-5-4, 5-4-4 retail calendars)
- Bi-weekly and semi-monthly period calculations
- Fiscal year presets for various countries (US, UK, Australia, etc.)
- Holiday management functionality
- Country-specific holiday sets
- Business day calculation utilities
- Fiscal year-to-date, quarter-to-date, and month-to-date calculations
- Date range information utilities
- Period comparison and year-over-year change calculations
- TypeScript examples and tests
- CI/CD pipeline with GitHub Actions
- Code coverage reporting
- Linting configuration

### Changed
- Restructured project to use TypeScript
- Updated build process to generate both CommonJS and ESM outputs
- Improved documentation with more examples
- Enhanced test coverage

### Fixed
- Jest configuration conflicts
- Various edge cases in date calculations

## [1.0.0] - 2023-01-01

### Added
- Initial release with basic fiscal year calendar functionality
- Support for custom fiscal year start dates
- Week, month, and quarter calculations
