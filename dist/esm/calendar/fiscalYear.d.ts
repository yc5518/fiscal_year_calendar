/**
 * Core fiscal year calendar functionality
 */
import moment from "moment";
import "moment-timezone";
import { WeekOption, QuarterOption, MonthOption, CalendarSystemType } from "../types";
/**
 * Gets the day of week number based on the start of week setting
 * @param {string} startOfWeek - The start of week setting
 * @returns {number} The day of week number (0-6)
 */
declare function getDayOfWeek(startOfWeek: string): number;
/**
 * Gets the fiscal year for a given date
 * @param {string|moment.Moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The fiscal year
 */
declare function calFiscalYear(date: string | moment.Moment, timezone?: string | null, fyStartMonth?: number, fyStartDay?: number): number;
/**
 * Gets the current week moment with the appropriate locale settings
 * @param {string} timezone - The timezone
 * @param {number} year - The year
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {moment.Moment} The moment object for the current week
 */
declare function getCurrentWeekMoment(timezone?: string | null, year?: number | null, startOfWeek?: string | null, fyStartMonth?: number, fyStartDay?: number): moment.Moment;
/**
 * Gets a moment object for the specified timezone
 * @param {string} timezone - The timezone
 * @returns {moment.Moment} The moment object for the timezone
 */
declare function getTimezone(timezone?: string): moment.Moment;
/**
 * Gets the start date of a fiscal year
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {moment.Moment} The start date of the fiscal year
 */
declare function calStartDate(timezone?: string | null, year?: number | null, startOfWeek?: string | null, fyStartMonth?: number, fyStartDay?: number): moment.Moment;
/**
 * Gets the end date of a fiscal year
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {moment.Moment} The end date of the fiscal year
 */
declare function calEndDate(timezone?: string | null, year?: number | null, startOfWeek?: string | null, fyStartMonth?: number, fyStartDay?: number): moment.Moment;
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
declare function buildWeekOptions(startOfWeek?: string, timezone?: string | null, year?: number | null, fyStartMonth?: number, fyStartDay?: number, calendarSystem?: CalendarSystemType): WeekOption[];
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
declare function buildQuarterOptions(startOfWeek?: string, timezone?: string | null, year?: number | null, fyStartMonth?: number, fyStartDay?: number, calendarSystem?: CalendarSystemType): QuarterOption[];
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
declare function buildMonthOptions(startOfWeek?: string, timezone?: string | null, year?: number | null, fyStartMonth?: number, fyStartDay?: number, calendarSystem?: CalendarSystemType): MonthOption[];
/**
 * Gets the date number within the fiscal year
 * @param {string|moment.Moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The date number within the fiscal year
 */
declare function calDateNum(date: string | moment.Moment, timezone?: string | null, startOfWeek?: string, fyStartMonth?: number, fyStartDay?: number): number;
/**
 * Gets the fiscal quarter for a given date
 * @param {string|moment.Moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The fiscal quarter (1-4)
 */
declare function calFiscalQuarter(date: string | moment.Moment, timezone?: string | null, startOfWeek?: string, fyStartMonth?: number, fyStartDay?: number): number;
/**
 * Gets the fiscal month for a given date
 * @param {string|moment.Moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The fiscal month (1-12)
 */
declare function calFiscalMonth(date: string | moment.Moment, timezone?: string | null, startOfWeek?: string, fyStartMonth?: number, fyStartDay?: number): number;
export { getDayOfWeek, calFiscalYear as getFiscalYear, getCurrentWeekMoment, getTimezone, calStartDate as getStartDate, calEndDate as getEndDate, buildWeekOptions as getWeekOptions, buildQuarterOptions as getQuarterOptions, buildMonthOptions as getMonthOptions, calDateNum as getDateNumber, calFiscalQuarter as getFiscalQuarter, calFiscalMonth as getFiscalMonth, };
