/**
 * Date range utilities for fiscal year calendar
 */
import moment from "moment";
import { DateRangeInfo } from "../types";
import {
    DEFAULT_FY_START_MONTH,
    DEFAULT_FY_START_DAY,
    START_OF_WEEK
} from "../utils/constants";
import {
    getFiscalYear,
    getFiscalQuarter,
    getFiscalMonth,
    getStartDate,
    getEndDate
} from "./fiscalYear";
import { getBusinessDaysInPeriod } from "./holidays";

/**
 * Gets the fiscal year-to-date range for a given date
 * @param {string|moment.Moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Object} The fiscal year-to-date range
 */
function getFiscalYearToDate(
    date: string | moment.Moment,
    timezone: string | null = null,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
): { startDate: moment.Moment; endDate: moment.Moment } {
    const dateMoment = moment.isMoment(date) ? date.clone() : moment(date);
    const fiscalYear = getFiscalYear(dateMoment, timezone, fyStartMonth, fyStartDay);
    
    const startDate = getStartDate(timezone, fiscalYear, null, fyStartMonth, fyStartDay);
    
    return {
        startDate,
        endDate: dateMoment.clone()
    };
}

/**
 * Gets the fiscal quarter-to-date range for a given date
 * @param {string|moment.Moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Object} The fiscal quarter-to-date range
 */
function getFiscalQuarterToDate(
    date: string | moment.Moment,
    timezone: string | null = null,
    startOfWeek: string = START_OF_WEEK.monday.value,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
): { startDate: moment.Moment; endDate: moment.Moment } {
    const dateMoment = moment.isMoment(date) ? date.clone() : moment(date);
    const fiscalYear = getFiscalYear(dateMoment, timezone, fyStartMonth, fyStartDay);
    const fiscalQuarter = getFiscalQuarter(dateMoment, timezone, startOfWeek, fyStartMonth, fyStartDay);
    
    // Get the start date of the fiscal year
    const fyStartDate = getStartDate(timezone, fiscalYear, startOfWeek, fyStartMonth, fyStartDay);
    
    // Calculate the start date of the quarter
    const quarterStartDate = fyStartDate.clone().add((fiscalQuarter - 1) * 3, "months");
    
    return {
        startDate: quarterStartDate,
        endDate: dateMoment.clone()
    };
}

/**
 * Gets the fiscal month-to-date range for a given date
 * @param {string|moment.Moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Object} The fiscal month-to-date range
 */
function getFiscalMonthToDate(
    date: string | moment.Moment,
    timezone: string | null = null,
    startOfWeek: string = START_OF_WEEK.monday.value,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
): { startDate: moment.Moment; endDate: moment.Moment } {
    const dateMoment = moment.isMoment(date) ? date.clone() : moment(date);
    const fiscalYear = getFiscalYear(dateMoment, timezone, fyStartMonth, fyStartDay);
    const fiscalMonth = getFiscalMonth(dateMoment, timezone, startOfWeek, fyStartMonth, fyStartDay);
    
    // Get the start date of the fiscal year
    const fyStartDate = getStartDate(timezone, fiscalYear, startOfWeek, fyStartMonth, fyStartDay);
    
    // Calculate the start date of the month
    const monthStartDate = fyStartDate.clone().add(fiscalMonth - 1, "months");
    
    return {
        startDate: monthStartDate,
        endDate: dateMoment.clone()
    };
}

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
function getDateRangeInfo(
    startDate: string | moment.Moment,
    endDate: string | moment.Moment,
    timezone: string | null = null,
    startOfWeek: string = START_OF_WEEK.monday.value,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
): DateRangeInfo {
    const start = moment.isMoment(startDate) ? startDate.clone() : moment(startDate);
    const end = moment.isMoment(endDate) ? endDate.clone() : moment(endDate);
    
    // Get fiscal year of the start date
    const fiscalYear = getFiscalYear(start, timezone, fyStartMonth, fyStartDay);
    
    // Calculate total days
    const totalDays = end.diff(start, "days") + 1;
    
    // Calculate business days
    const totalBusinessDays = getBusinessDaysInPeriod(start, end);
    
    // Get weeks, months, and quarters covered by the date range
    const weeks: string[] = [];
    const months: string[] = [];
    const quarters: string[] = [];
    
    const current = start.clone();
    while (current.isSameOrBefore(end, "day")) {
        // Get week, month, and quarter for the current date
        const week = current.format("YYYY-[W]WW");
        const month = current.format("YYYY-MM");
        const quarter = `${fiscalYear}-Q${getFiscalQuarter(current, timezone, startOfWeek, fyStartMonth, fyStartDay)}`;
        
        // Add to arrays if not already included
        if (!weeks.includes(week)) {
            weeks.push(week);
        }
        
        if (!months.includes(month)) {
            months.push(month);
        }
        
        if (!quarters.includes(quarter)) {
            quarters.push(quarter);
        }
        
        current.add(1, "day");
    }
    
    return {
        startDate: start.format("YYYY-MM-DD"),
        endDate: end.format("YYYY-MM-DD"),
        fiscalYear,
        weeks,
        months,
        quarters,
        totalDays,
        totalBusinessDays
    };
}

export {
    getFiscalYearToDate,
    getFiscalQuarterToDate,
    getFiscalMonthToDate,
    getDateRangeInfo
};
