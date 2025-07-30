import { WeekOption, QuarterOption, MonthOption, CalendarSystemType } from "../types";
import { DateInput } from "../utils/dateUtils";
/**
 * Gets the day of week number based on the start of week setting
 * @param {string} startOfWeek - The start of week setting
 * @returns {number} The day of week number (0-6)
 */
declare function getDayOfWeek(startOfWeek: string): number;
/**
 * Gets the fiscal year for a given date
 * @param {DateInput} date - The date to check
 * @param {string} timezone - The timezone
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The fiscal year
 */
declare function getFiscalYear(date: DateInput, timezone?: string | null, fyStartMonth?: number, fyStartDay?: number): number;
/**
 * Gets the current week date with the appropriate settings
 * @param {string} timezone - The timezone
 * @param {number} year - The year
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Date} The date object for the current week
 */
declare function getCurrentWeekDate(timezone?: string | null, year?: number | null, weekStartDay?: string | null, fyStartMonth?: number, fyStartDay?: number): Date;
/**
 * Gets a date object for the specified timezone
 * @param {string} timezone - The timezone
 * @returns {Date} The date object for the timezone
 */
declare function getTimezone(timezone?: string): Date;
/**
 * Gets the start date of a fiscal year
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Date} The start date of the fiscal year
 */
declare function getStartDate(timezone?: string | null, year?: number | null, weekStartDay?: string | null, fyStartMonth?: number, fyStartDay?: number): Date;
/**
 * Gets the end date of a fiscal year
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Date} The end date of the fiscal year
 */
declare function getEndDate(timezone?: string | null, year?: number | null, weekStartDay?: string | null, fyStartMonth?: number, fyStartDay?: number): Date;
/**
 * Builds week options for a fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @param {string} calendarSystem - The calendar system type
 * @returns {Array<WeekOption>} The week options for the fiscal year
 */
declare function getWeekOptions(weekStartDay?: string, timezone?: string | null, year?: number | null, fyStartMonth?: number, fyStartDay?: number, calendarSystem?: CalendarSystemType): WeekOption[];
/**
 * Builds quarter options for a fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @param {string} calendarSystem - The calendar system type
 * @returns {Array<QuarterOption>} The quarter options for the fiscal year
 */
declare function getQuarterOptions(weekStartDay?: string, timezone?: string | null, year?: number | null, fyStartMonth?: number, fyStartDay?: number, calendarSystem?: CalendarSystemType): QuarterOption[];
/**
 * Builds month options for a fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @param {string} calendarSystem - The calendar system type
 * @returns {Array<MonthOption>} The month options for the fiscal year
 */
declare function getMonthOptions(weekStartDay?: string, timezone?: string | null, year?: number | null, fyStartMonth?: number, fyStartDay?: number, calendarSystem?: CalendarSystemType): MonthOption[];
/**
 * Gets the date number within the fiscal year
 * @param {DateInput} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The date number within the fiscal year
 */
declare function getDateNumber(date: DateInput, timezone?: string | null, weekStartDay?: string, fyStartMonth?: number, fyStartDay?: number): number;
/**
 * Gets the fiscal quarter for a given date
 * @param {DateInput} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The fiscal quarter (1-4)
 */
declare function getFiscalQuarter(date: DateInput, timezone?: string | null, weekStartDay?: string, fyStartMonth?: number, fyStartDay?: number): number;
/**
 * Gets the fiscal month for a given date
 * @param {DateInput} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The fiscal month (1-12)
 */
declare function getFiscalMonth(date: DateInput, timezone?: string | null, weekStartDay?: string, fyStartMonth?: number, fyStartDay?: number): number;
export { getDayOfWeek, getFiscalYear, getCurrentWeekDate, getTimezone, getStartDate, getEndDate, getWeekOptions, getQuarterOptions, getMonthOptions, getDateNumber, getFiscalQuarter, getFiscalMonth, };
