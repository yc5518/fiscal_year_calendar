/**
 * Types for fiscal-year-calendar library
 */
/**
 * Start of week options
 */
export interface StartOfWeekOption {
    value: string;
    label: string;
}
/**
 * Start of week constants
 */
export interface StartOfWeek {
    monday: StartOfWeekOption;
    sunday: StartOfWeekOption;
    saturday: StartOfWeekOption;
}
/**
 * Calendar system types
 */
export type CalendarSystemType = 'standard' | '4-4-5' | '4-5-4' | '5-4-4';
/**
 * Week option structure
 */
export interface WeekOption {
    week: string;
    startTime: string;
    endTime: string;
}
/**
 * Quarter option structure
 */
export interface QuarterOption {
    quarter: string;
    startTime: string;
    endTime: string;
}
/**
 * Month option structure
 */
export interface MonthOption {
    month: string;
    name: string;
    startTime: string;
    endTime: string;
}
/**
 * Period option structure (for 4-4-5, 4-5-4, 5-4-4 calendars)
 */
export interface PeriodOption {
    period: string;
    startTime: string;
    endTime: string;
    weeks: number;
}
/**
 * Bi-weekly period option structure
 */
export interface BiWeeklyOption {
    period: string;
    startTime: string;
    endTime: string;
}
/**
 * Semi-monthly period option structure
 */
export interface SemiMonthlyOption {
    period: string;
    startTime: string;
    endTime: string;
}
/**
 * Holiday definition
 */
export interface Holiday {
    date: string | Date;
    name: string;
    recurring: boolean;
}
/**
 * Fiscal year configuration
 */
export interface FiscalYearConfig {
    startOfWeek?: string;
    timezone?: string | null;
    year?: number | null;
    fyStartMonth?: number;
    fyStartDay?: number;
    calendarSystem?: CalendarSystemType;
}
/**
 * Country code for holiday sets
 */
export type CountryCode = 'US' | 'UK' | 'CA' | 'AU' | 'NZ' | 'IN' | 'JP' | 'CN';
/**
 * Fiscal year preset
 */
export interface FiscalYearPreset {
    name: string;
    fyStartMonth: number;
    fyStartDay: number;
    description?: string;
}
/**
 * Period type for comparisons
 */
export type PeriodType = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'biweekly' | 'semimonthly';
/**
 * Date range information
 */
export interface DateRangeInfo {
    startDate: string;
    endDate: string;
    fiscalYear: number;
    weeks: string[];
    months: string[];
    quarters: string[];
    totalDays: number;
    totalBusinessDays: number;
}
/**
 * Year over year change
 */
export interface YearOverYearChange {
    currentPeriod: string;
    previousPeriod: string;
    absoluteChange: number;
    percentageChange: number;
}
