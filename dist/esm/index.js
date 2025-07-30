/**
 * Fiscal Year Calendar
 * A library to generate fiscal year calendar based on custom fiscal year start date
 *
 * This is the main entry point that re-exports all functionality from submodules.
 * For better tree-shaking, consider importing directly from submodules:
 *
 * import { getFiscalYear } from 'fiscal-year-calendar/calendar';
 * import { formatDate } from 'fiscal-year-calendar/utils';
 * import { WeekOption } from 'fiscal-year-calendar/types';
 */
// Export types
export * from "./types";
// Export all calendar functionality
export * from "./calendar";
// Export all utilities
export * from "./utils";
