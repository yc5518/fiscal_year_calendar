/**
 * Date range utilities for fiscal year calendar
 */
import moment from "moment";
import { DateRangeInfo } from "../types";
/**
 * Gets the fiscal year-to-date range for a given date
 * @param {string|moment.Moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Object} The fiscal year-to-date range
 */
declare function getFiscalYearToDate(date: string | moment.Moment, timezone?: string | null, fyStartMonth?: number, fyStartDay?: number): {
    startDate: moment.Moment;
    endDate: moment.Moment;
};
/**
 * Gets the fiscal quarter-to-date range for a given date
 * @param {string|moment.Moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Object} The fiscal quarter-to-date range
 */
declare function getFiscalQuarterToDate(date: string | moment.Moment, timezone?: string | null, startOfWeek?: string, fyStartMonth?: number, fyStartDay?: number): {
    startDate: moment.Moment;
    endDate: moment.Moment;
};
/**
 * Gets the fiscal month-to-date range for a given date
 * @param {string|moment.Moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Object} The fiscal month-to-date range
 */
declare function getFiscalMonthToDate(date: string | moment.Moment, timezone?: string | null, startOfWeek?: string, fyStartMonth?: number, fyStartDay?: number): {
    startDate: moment.Moment;
    endDate: moment.Moment;
};
/**
 * Gets information about a date range within the fiscal calendar
 * @param {string|moment.Moment} startDate - The start date
 * @param {string|moment.Moment} endDate - The end date
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {DateRangeInfo} Information about the date range
 */
declare function getDateRangeInfo(startDate: string | moment.Moment, endDate: string | moment.Moment, timezone?: string | null, startOfWeek?: string, fyStartMonth?: number, fyStartDay?: number): DateRangeInfo;
export { getFiscalYearToDate, getFiscalQuarterToDate, getFiscalMonthToDate, getDateRangeInfo };
