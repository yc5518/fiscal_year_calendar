import { PeriodOption, BiWeeklyOption, SemiMonthlyOption, CalendarSystemType } from "../types";
/**
 * Gets retail calendar options (4-4-5, 4-5-4, 5-4-4) for a fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {string} calendarSystem - The calendar system type (4-4-5, 4-5-4, 5-4-4)
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Array<PeriodOption>} The period options for the fiscal year
 */
declare function getRetailCalendarOptions(startOfWeek?: string, timezone?: string | null, year?: number | null, calendarSystem?: CalendarSystemType, fyStartMonth?: number, fyStartDay?: number): PeriodOption[];
/**
 * Gets bi-weekly period options for a fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Array<BiWeeklyOption>} The bi-weekly period options for the fiscal year
 */
declare function getBiWeeklyOptions(startOfWeek?: string, timezone?: string | null, year?: number | null, fyStartMonth?: number, fyStartDay?: number): BiWeeklyOption[];
/**
 * Gets semi-monthly period options for a fiscal year (1st and 15th of each month)
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Array<SemiMonthlyOption>} The semi-monthly period options for the fiscal year
 */
declare function getSemiMonthlyOptions(timezone?: string | null, year?: number | null, fyStartMonth?: number, fyStartDay?: number): SemiMonthlyOption[];
export { getRetailCalendarOptions, getBiWeeklyOptions, getSemiMonthlyOptions };
