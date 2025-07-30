"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDayOfWeek = getDayOfWeek;
exports.getFiscalYear = getFiscalYear;
exports.getCurrentWeekDate = getCurrentWeekDate;
exports.getTimezone = getTimezone;
exports.getStartDate = getStartDate;
exports.getEndDate = getEndDate;
exports.getWeekOptions = getWeekOptions;
exports.getQuarterOptions = getQuarterOptions;
exports.getMonthOptions = getMonthOptions;
exports.getDateNumber = getDateNumber;
exports.getFiscalQuarter = getFiscalQuarter;
exports.getFiscalMonth = getFiscalMonth;
/**
 * Core fiscal year calendar functionality using date-fns
 */
const date_fns_1 = require("date-fns");
const constants_1 = require("../utils/constants");
const dateUtils_1 = require("../utils/dateUtils");
/**
 * Gets the day of week number based on the start of week setting
 * @param {string} startOfWeek - The start of week setting
 * @returns {number} The day of week number (0-6)
 */
function getDayOfWeek(startOfWeek) {
    switch (startOfWeek) {
        case constants_1.START_OF_WEEK.sunday.value:
            return 0; // Sunday
        case constants_1.START_OF_WEEK.saturday.value:
            return 6; // Saturday
        case constants_1.START_OF_WEEK.monday.value:
        default:
            return 1; // Monday
    }
}
/**
 * Gets the fiscal year for a given date
 * @param {DateInput} date - The date to check
 * @param {string} timezone - The timezone
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The fiscal year
 */
function getFiscalYear(date, timezone = null, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    const dateObj = (0, dateUtils_1.toDateObject)(date, timezone || undefined);
    const month = (0, date_fns_1.getMonth)(dateObj);
    const year = (0, date_fns_1.getYear)(dateObj);
    // If the date is before the fiscal year start date, it belongs to the previous fiscal year
    if (month < fyStartMonth || (month === fyStartMonth && (0, date_fns_1.getDate)(dateObj) < fyStartDay)) {
        return year;
    }
    return year + 1;
}
/**
 * Gets the current week date with the appropriate settings
 * @param {string} timezone - The timezone
 * @param {number} year - The year
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Date} The date object for the current week
 */
function getCurrentWeekDate(timezone = null, year = null, weekStartDay = null, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    // We are actually using currentWeek to get current year
    let currentWeek = (0, dateUtils_1.createDate)(undefined, timezone || undefined);
    if (year) {
        currentWeek = (0, date_fns_1.setYear)(currentWeek, year - 1);
    }
    // FY represents Fiscal Year(Financial Year)
    // dayInFirstWeek is the day must be included in first week of FY.
    let dayInFirstWeek = (0, dateUtils_1.cloneDate)(currentWeek);
    dayInFirstWeek = (0, date_fns_1.setMonth)(dayInFirstWeek, fyStartMonth);
    dayInFirstWeek = (0, date_fns_1.setDate)(dayInFirstWeek, fyStartDay);
    // startDateOfFY must be start date of the week which contains dayInFirstWeek
    const dow = getDayOfWeek(weekStartDay || constants_1.START_OF_WEEK.monday.value);
    const startDateOfFY = (0, date_fns_1.startOfWeek)(dayInFirstWeek, { weekStartsOn: dow });
    return dayInFirstWeek;
}
/**
 * Gets a date object for the specified timezone
 * @param {string} timezone - The timezone
 * @returns {Date} The date object for the timezone
 */
function getTimezone(timezone) {
    return (0, dateUtils_1.createDate)(undefined, timezone);
}
/**
 * Gets the start date of a fiscal year
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Date} The start date of the fiscal year
 */
function getStartDate(timezone = null, year = null, weekStartDay = null, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    let currentTime = (0, dateUtils_1.createDate)(undefined, timezone || undefined);
    if (year) {
        currentTime = (0, date_fns_1.setYear)(currentTime, year);
    }
    // Get the day that must be in the first week of the fiscal year
    let dayInFirstWeek = (0, dateUtils_1.cloneDate)(currentTime);
    dayInFirstWeek = (0, dateUtils_1.subtractTime)(dayInFirstWeek, 1, 'years');
    dayInFirstWeek = (0, date_fns_1.setMonth)(dayInFirstWeek, fyStartMonth);
    dayInFirstWeek = (0, date_fns_1.setDate)(dayInFirstWeek, fyStartDay);
    // Get the start date of the week containing the first day of the fiscal year
    const dow = getDayOfWeek(weekStartDay || constants_1.START_OF_WEEK.monday.value);
    return (0, date_fns_1.startOfWeek)(dayInFirstWeek, { weekStartsOn: dow });
}
/**
 * Gets the end date of a fiscal year
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Date} The end date of the fiscal year
 */
function getEndDate(timezone = null, year = null, weekStartDay = null, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    let currentTime = (0, dateUtils_1.createDate)(undefined, timezone || undefined);
    if (year) {
        currentTime = (0, date_fns_1.setYear)(currentTime, year);
    }
    // Get the day that must be in the first week of the next fiscal year
    let dayInFirstWeekNextYear = (0, dateUtils_1.cloneDate)(currentTime);
    dayInFirstWeekNextYear = (0, date_fns_1.setMonth)(dayInFirstWeekNextYear, fyStartMonth);
    dayInFirstWeekNextYear = (0, date_fns_1.setDate)(dayInFirstWeekNextYear, fyStartDay);
    // Get the start date of the week containing the first day of the next fiscal year
    const dow = getDayOfWeek(weekStartDay || constants_1.START_OF_WEEK.monday.value);
    const startDateOfNextFY = (0, date_fns_1.startOfWeek)(dayInFirstWeekNextYear, { weekStartsOn: dow });
    // The end date of the current fiscal year is the day before the start of the next fiscal year
    return (0, dateUtils_1.subtractTime)(startDateOfNextFY, 1, 'days');
}
/**
 * Helper function to create a week option structure
 * @param {string} value - The week number
 * @param {Date} start - The start date
 * @param {Date} end - The end date
 * @returns {WeekOption} The week option structure
 */
function createWeekOption(value, start, end) {
    return {
        week: String(value).toLowerCase(),
        startTime: start.toString(),
        endTime: end.toString(),
    };
}
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
function getWeekOptions(weekStartDay = constants_1.START_OF_WEEK.monday.value, timezone = null, year = null, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY, calendarSystem = constants_1.CALENDAR_SYSTEMS.STANDARD) {
    const startDateObj = getStartDate(timezone, year, weekStartDay, fyStartMonth, fyStartDay);
    const endDateObj = getEndDate(timezone, year, weekStartDay, fyStartMonth, fyStartDay);
    // Calculate the number of weeks in the fiscal year
    const diffInDays = (0, date_fns_1.differenceInDays)(endDateObj, startDateObj) + 1;
    const weeksOfCurrentFiscalYear = Math.ceil(diffInDays / 7);
    const weeks = [];
    const dow = getDayOfWeek(weekStartDay);
    for (let i = 0; i < weeksOfCurrentFiscalYear; i++) {
        const weekStart = (0, date_fns_1.addDays)(startDateObj, i * 7);
        const weekEnd = (0, date_fns_1.endOfWeek)(weekStart, { weekStartsOn: dow });
        weeks.push(createWeekOption(i + 1, weekStart, weekEnd));
    }
    return weeks;
}
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
function getQuarterOptions(weekStartDay = constants_1.START_OF_WEEK.monday.value, timezone = null, year = null, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY, calendarSystem = constants_1.CALENDAR_SYSTEMS.STANDARD) {
    const startDateObj = getStartDate(timezone, year, weekStartDay, fyStartMonth, fyStartDay);
    const quarters = [];
    for (let i = 0; i < 4; i++) {
        const quarterStart = (0, date_fns_1.addMonths)(startDateObj, i * 3);
        const quarterEnd = (0, date_fns_1.addDays)((0, date_fns_1.addMonths)(quarterStart, 3), -1);
        quarters.push({
            quarter: String(i + 1),
            startTime: quarterStart.toString(),
            endTime: quarterEnd.toString(),
        });
    }
    return quarters;
}
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
function getMonthOptions(weekStartDay = constants_1.START_OF_WEEK.monday.value, timezone = null, year = null, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY, calendarSystem = constants_1.CALENDAR_SYSTEMS.STANDARD) {
    const startDateObj = getStartDate(timezone, year, weekStartDay, fyStartMonth, fyStartDay);
    const months = [];
    for (let i = 0; i < 12; i++) {
        const monthStart = (0, date_fns_1.addMonths)(startDateObj, i);
        const monthEnd = (0, date_fns_1.endOfMonth)(monthStart);
        months.push({
            month: String(i + 1),
            name: (0, date_fns_1.format)(monthStart, 'MMMM'),
            startTime: monthStart.toString(),
            endTime: monthEnd.toString(),
        });
    }
    return months;
}
/**
 * Gets the date number within the fiscal year
 * @param {DateInput} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The date number within the fiscal year
 */
function getDateNumber(date, timezone = null, weekStartDay = constants_1.START_OF_WEEK.monday.value, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    const dateObj = (0, dateUtils_1.toDateObject)(date, timezone || undefined);
    const fiscalYear = getFiscalYear(dateObj, timezone, fyStartMonth, fyStartDay);
    const startDateObj = getStartDate(timezone, fiscalYear, weekStartDay, fyStartMonth, fyStartDay);
    return (0, date_fns_1.differenceInDays)(dateObj, startDateObj) + 1;
}
/**
 * Gets the fiscal quarter for a given date
 * @param {DateInput} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The fiscal quarter (1-4)
 */
function getFiscalQuarter(date, timezone = null, weekStartDay = constants_1.START_OF_WEEK.monday.value, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    const dateObj = (0, dateUtils_1.toDateObject)(date, timezone || undefined);
    const fiscalYear = getFiscalYear(dateObj, timezone, fyStartMonth, fyStartDay);
    const startDateObj = getStartDate(timezone, fiscalYear, weekStartDay, fyStartMonth, fyStartDay);
    const monthDiff = (0, date_fns_1.differenceInMonths)(dateObj, startDateObj);
    return Math.floor(monthDiff / 3) + 1;
}
/**
 * Gets the fiscal month for a given date
 * @param {DateInput} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The fiscal month (1-12)
 */
function getFiscalMonth(date, timezone = null, weekStartDay = constants_1.START_OF_WEEK.monday.value, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    const dateObj = (0, dateUtils_1.toDateObject)(date, timezone || undefined);
    const fiscalYear = getFiscalYear(dateObj, timezone, fyStartMonth, fyStartDay);
    const startDateObj = getStartDate(timezone, fiscalYear, weekStartDay, fyStartMonth, fyStartDay);
    const monthDiff = (0, date_fns_1.differenceInMonths)(dateObj, startDateObj);
    return monthDiff + 1;
}
