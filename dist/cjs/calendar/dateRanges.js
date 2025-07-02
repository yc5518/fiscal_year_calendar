"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiscalYearToDate = getFiscalYearToDate;
exports.getFiscalQuarterToDate = getFiscalQuarterToDate;
exports.getFiscalMonthToDate = getFiscalMonthToDate;
exports.getDateRangeInfo = getDateRangeInfo;
/**
 * Date range utilities for fiscal year calendar
 */
const moment_1 = __importDefault(require("moment"));
const constants_1 = require("../utils/constants");
const fiscalYear_1 = require("./fiscalYear");
const holidays_1 = require("./holidays");
/**
 * Gets the fiscal year-to-date range for a given date
 * @param {string|moment.Moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Object} The fiscal year-to-date range
 */
function getFiscalYearToDate(date, timezone = null, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    const dateMoment = moment_1.default.isMoment(date) ? date.clone() : (0, moment_1.default)(date);
    const fiscalYear = (0, fiscalYear_1.getFiscalYear)(dateMoment, timezone, fyStartMonth, fyStartDay);
    const startDate = (0, fiscalYear_1.getStartDate)(timezone, fiscalYear, null, fyStartMonth, fyStartDay);
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
function getFiscalQuarterToDate(date, timezone = null, startOfWeek = constants_1.START_OF_WEEK.monday.value, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    const dateMoment = moment_1.default.isMoment(date) ? date.clone() : (0, moment_1.default)(date);
    const fiscalYear = (0, fiscalYear_1.getFiscalYear)(dateMoment, timezone, fyStartMonth, fyStartDay);
    const fiscalQuarter = (0, fiscalYear_1.getFiscalQuarter)(dateMoment, timezone, startOfWeek, fyStartMonth, fyStartDay);
    // Get the start date of the fiscal year
    const fyStartDate = (0, fiscalYear_1.getStartDate)(timezone, fiscalYear, startOfWeek, fyStartMonth, fyStartDay);
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
function getFiscalMonthToDate(date, timezone = null, startOfWeek = constants_1.START_OF_WEEK.monday.value, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    const dateMoment = moment_1.default.isMoment(date) ? date.clone() : (0, moment_1.default)(date);
    const fiscalYear = (0, fiscalYear_1.getFiscalYear)(dateMoment, timezone, fyStartMonth, fyStartDay);
    const fiscalMonth = (0, fiscalYear_1.getFiscalMonth)(dateMoment, timezone, startOfWeek, fyStartMonth, fyStartDay);
    // Get the start date of the fiscal year
    const fyStartDate = (0, fiscalYear_1.getStartDate)(timezone, fiscalYear, startOfWeek, fyStartMonth, fyStartDay);
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
function getDateRangeInfo(startDate, endDate, timezone = null, startOfWeek = constants_1.START_OF_WEEK.monday.value, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    const start = moment_1.default.isMoment(startDate) ? startDate.clone() : (0, moment_1.default)(startDate);
    const end = moment_1.default.isMoment(endDate) ? endDate.clone() : (0, moment_1.default)(endDate);
    // Get fiscal year of the start date
    const fiscalYear = (0, fiscalYear_1.getFiscalYear)(start, timezone, fyStartMonth, fyStartDay);
    // Calculate total days
    const totalDays = end.diff(start, "days") + 1;
    // Calculate business days
    const totalBusinessDays = (0, holidays_1.getBusinessDaysInPeriod)(start, end);
    // Get weeks, months, and quarters covered by the date range
    const weeks = [];
    const months = [];
    const quarters = [];
    const current = start.clone();
    while (current.isSameOrBefore(end, "day")) {
        // Get week, month, and quarter for the current date
        const week = current.format("YYYY-[W]WW");
        const month = current.format("YYYY-MM");
        const quarter = `${fiscalYear}-Q${(0, fiscalYear_1.getFiscalQuarter)(current, timezone, startOfWeek, fyStartMonth, fyStartDay)}`;
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
