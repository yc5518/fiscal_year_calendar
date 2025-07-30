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
export * from "./types";
export * from "./calendar";
export * from "./utils";
