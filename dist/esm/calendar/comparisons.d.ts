/**
 * Fiscal year comparison utilities
 */
import moment from "moment";
import { YearOverYearChange, PeriodType } from "../types";
/**
 * Gets the same period from the previous fiscal year
 * @param {string|moment.Moment} date - The date to check
 * @param {PeriodType} periodType - The type of period (day, week, month, quarter, year)
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Object} The same period from the previous fiscal year
 */
declare function getSamePeriodLastYear(date: string | moment.Moment, periodType?: PeriodType, timezone?: string | null, startOfWeek?: string, fyStartMonth?: number, fyStartDay?: number): {
    currentPeriod: moment.Moment;
    previousPeriod: moment.Moment;
};
/**
 * Compares two fiscal periods
 * @param {Object} period1 - The first period
 * @param {Object} period2 - The second period
 * @returns {Object} The comparison result
 */
declare function compareFiscalPeriods(period1: {
    startDate: moment.Moment;
    endDate: moment.Moment;
}, period2: {
    startDate: moment.Moment;
    endDate: moment.Moment;
}): {
    daysDiff: number;
    period1Days: number;
    period2Days: number;
    period1WeekdayCount: number;
    period2WeekdayCount: number;
};
/**
 * Calculates the year-over-year change between two values
 * @param {number} currentValue - The current value
 * @param {number} previousValue - The previous value
 * @param {string} currentPeriod - The current period description
 * @param {string} previousPeriod - The previous period description
 * @returns {YearOverYearChange} The year-over-year change
 */
declare function getYearOverYearChange(currentValue: number, previousValue: number, currentPeriod?: string, previousPeriod?: string): YearOverYearChange;
export { getSamePeriodLastYear, compareFiscalPeriods, getYearOverYearChange };
