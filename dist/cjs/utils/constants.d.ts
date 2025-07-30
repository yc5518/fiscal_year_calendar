/**
 * Constants for fiscal-year-calendar library
 */
import { StartOfWeek, FiscalYearPreset } from '../types';
export declare const DEFAULT_FY_START_MONTH = 9;
export declare const DEFAULT_FY_START_DAY = 1;
export declare const DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
export declare const FIRST_DAY_NUM_OF_WEEK = 0;
export declare const START_OF_WEEK: StartOfWeek;
export declare const CALENDAR_SYSTEMS: {
    STANDARD: string;
    RETAIL_445: string;
    RETAIL_454: string;
    RETAIL_544: string;
};
export declare const FISCAL_YEAR_PRESETS: Record<string, FiscalYearPreset>;
