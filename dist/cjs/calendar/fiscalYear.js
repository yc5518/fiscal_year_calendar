"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDayOfWeek = getDayOfWeek;
exports.getFiscalYear = calFiscalYear;
exports.getCurrentWeekMoment = getCurrentWeekMoment;
exports.getTimezone = getTimezone;
exports.getStartDate = calStartDate;
exports.getEndDate = calEndDate;
exports.getWeekOptions = buildWeekOptions;
exports.getQuarterOptions = buildQuarterOptions;
exports.getMonthOptions = buildMonthOptions;
exports.getDateNumber = calDateNum;
exports.getFiscalQuarter = calFiscalQuarter;
exports.getFiscalMonth = calFiscalMonth;
/**
 * Core fiscal year calendar functionality
 */
const moment_1 = __importDefault(require("moment"));
require("moment-timezone");
const constants_1 = require("../utils/constants");
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
 * @param {string|moment.Moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The fiscal year
 */
function calFiscalYear(date, timezone = null, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    const dateMoment = moment_1.default.isMoment(date) ? date.clone() : (timezone ? moment_1.default.tz(String(date), timezone) : (0, moment_1.default)(String(date)));
    const month = dateMoment.month();
    const year = dateMoment.year();
    // If the date is before the fiscal year start date, it belongs to the previous fiscal year
    if (month < fyStartMonth || (month === fyStartMonth && dateMoment.date() < fyStartDay)) {
        return year;
    }
    return year + 1;
}
/**
 * Gets the current week moment with the appropriate locale settings
 * @param {string} timezone - The timezone
 * @param {number} year - The year
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {moment.Moment} The moment object for the current week
 */
function getCurrentWeekMoment(timezone = null, year = null, startOfWeek = null, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    // We are actually using currentWeek to get current year
    const currentWeek = timezone ? moment_1.default.tz(timezone) : (0, moment_1.default)();
    if (year) {
        currentWeek.year(year - 1);
    }
    // FY represents Fiscal Year(Financial Year)
    // dayInFirstWeek is the day must be included in first week of FY.
    const dayInFirstWeek = currentWeek.clone().month(fyStartMonth).date(fyStartDay);
    // startDateOfFY must be start date of the week which contains dayInFirstWeek
    const dow = getDayOfWeek(startOfWeek || constants_1.START_OF_WEEK.monday.value);
    const startDateOfFY = dayInFirstWeek.clone().weekday(constants_1.FIRST_DAY_NUM_OF_WEEK);
    const firstDayOfLastYear = dayInFirstWeek.clone().month(0).startOf("month");
    // Day number of the fiscal year start date in a year, to be used in calculating `doy` in updating locale
    // `diff()` calculates the gap between two days
    const dayOfYearOfStartDateOfCurrentFY = startDateOfFY.diff(firstDayOfLastYear, "days") + 1;
    moment_1.default.updateLocale("facilityReportLocal", {
        week: {
            dow, // First day of week
            doy: 7 + dow - dayOfYearOfStartDateOfCurrentFY, // First week of year must contain the fiscal year start date
        },
    });
    // Changed to dayInFirstWeek because it must be within the FY we want
    dayInFirstWeek.locale("facilityReportLocal");
    return dayInFirstWeek;
}
/**
 * Gets a moment object for the specified timezone
 * @param {string} timezone - The timezone
 * @returns {moment.Moment} The moment object for the timezone
 */
function getTimezone(timezone) {
    return timezone ? moment_1.default.tz(timezone) : (0, moment_1.default)();
}
/**
 * Gets the start date of a fiscal year
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {moment.Moment} The start date of the fiscal year
 */
function calStartDate(timezone = null, year = null, startOfWeek = null, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    const currentTime = timezone ? moment_1.default.tz(timezone) : (0, moment_1.default)();
    if (year) {
        currentTime.year(year);
    }
    // Get the day that must be in the first week of the fiscal year
    const dayInFirstWeek = currentTime.clone().subtract(1, "y").month(fyStartMonth).date(fyStartDay);
    // Get the start date of the week containing the first day of the fiscal year
    return dayInFirstWeek.clone().weekday(constants_1.FIRST_DAY_NUM_OF_WEEK);
}
/**
 * Gets the end date of a fiscal year
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {moment.Moment} The end date of the fiscal year
 */
function calEndDate(timezone = null, year = null, startOfWeek = null, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    const currentTime = timezone ? moment_1.default.tz(timezone) : (0, moment_1.default)();
    if (year) {
        currentTime.year(year);
    }
    // Get the day that must be in the first week of the next fiscal year
    const dayInFirstWeekNextYear = currentTime.clone().month(fyStartMonth).date(fyStartDay);
    // Get the start date of the week containing the first day of the next fiscal year
    const startDateOfNextFY = dayInFirstWeekNextYear.clone().weekday(constants_1.FIRST_DAY_NUM_OF_WEEK);
    // The end date of the current fiscal year is the day before the start of the next fiscal year
    return startDateOfNextFY.clone().subtract(1, "day");
}
/**
 * Helper function to create a week option structure
 * @param {string} value - The week number
 * @param {moment.Moment} start - The start date
 * @param {moment.Moment} end - The end date
 * @returns {WeekOption} The week option structure
 */
function selectOptionStructureWithLabel(value, start, end) {
    return {
        week: String(value).toLowerCase(),
        startTime: String(start),
        endTime: String(end),
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
function buildWeekOptions(startOfWeek = constants_1.START_OF_WEEK.monday.value, timezone = null, year = null, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY, calendarSystem = constants_1.CALENDAR_SYSTEMS.STANDARD) {
    const startDate = calStartDate(timezone, year, startOfWeek, fyStartMonth, fyStartDay);
    const endDate = calEndDate(timezone, year, startOfWeek, fyStartMonth, fyStartDay);
    // Calculate the number of weeks in the fiscal year
    const diffInDays = endDate.diff(startDate, "days") + 1;
    const weeksOfCurrentFiscalYear = Math.ceil(diffInDays / 7);
    const weeks = [];
    for (let i = 1; i <= weeksOfCurrentFiscalYear; i++) {
        weeks.push(i);
    }
    const currentWeek = getCurrentWeekMoment(timezone, year, startOfWeek, fyStartMonth, fyStartDay);
    const format = "llll";
    return weeks.map((value) => {
        currentWeek.week(value);
        return selectOptionStructureWithLabel(String(value), currentWeek.startOf("week").clone(), currentWeek.endOf("week").clone());
    });
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
function buildQuarterOptions(startOfWeek = constants_1.START_OF_WEEK.monday.value, timezone = null, year = null, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY, calendarSystem = constants_1.CALENDAR_SYSTEMS.STANDARD) {
    const startDate = calStartDate(timezone, year, startOfWeek, fyStartMonth, fyStartDay);
    const quarters = [];
    for (let i = 1; i <= 4; i++) {
        const quarterStart = startDate.clone().add((i - 1) * 3, "months");
        const quarterEnd = quarterStart.clone().add(3, "months").subtract(1, "day");
        quarters.push({
            quarter: String(i),
            startTime: quarterStart.format("llll"),
            endTime: quarterEnd.format("llll"),
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
function buildMonthOptions(startOfWeek = constants_1.START_OF_WEEK.monday.value, timezone = null, year = null, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY, calendarSystem = constants_1.CALENDAR_SYSTEMS.STANDARD) {
    const startDate = calStartDate(timezone, year, startOfWeek, fyStartMonth, fyStartDay);
    const months = [];
    for (let i = 0; i < 12; i++) {
        const monthStart = startDate.clone().add(i, "months");
        const monthEnd = monthStart.clone().endOf("month");
        months.push({
            month: String(i + 1),
            name: monthStart.format("MMMM"),
            startTime: monthStart.format("llll"),
            endTime: monthEnd.format("llll"),
        });
    }
    return months;
}
/**
 * Gets the date number within the fiscal year
 * @param {string|moment.Moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The date number within the fiscal year
 */
function calDateNum(date, timezone = null, startOfWeek = constants_1.START_OF_WEEK.monday.value, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    const dateMoment = moment_1.default.isMoment(date) ? date.clone() : (timezone ? moment_1.default.tz(String(date), timezone) : (0, moment_1.default)(String(date)));
    const fiscalYear = calFiscalYear(dateMoment, timezone, fyStartMonth, fyStartDay);
    const startDate = calStartDate(timezone, fiscalYear, startOfWeek, fyStartMonth, fyStartDay);
    return dateMoment.diff(startDate, "days") + 1;
}
/**
 * Gets the fiscal quarter for a given date
 * @param {string|moment.Moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The fiscal quarter (1-4)
 */
function calFiscalQuarter(date, timezone = null, startOfWeek = constants_1.START_OF_WEEK.monday.value, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    const dateMoment = moment_1.default.isMoment(date) ? date.clone() : (timezone ? moment_1.default.tz(String(date), timezone) : (0, moment_1.default)(String(date)));
    const fiscalYear = calFiscalYear(dateMoment, timezone, fyStartMonth, fyStartDay);
    const startDate = calStartDate(timezone, fiscalYear, startOfWeek, fyStartMonth, fyStartDay);
    const monthDiff = dateMoment.diff(startDate, "months");
    return Math.floor(monthDiff / 3) + 1;
}
/**
 * Gets the fiscal month for a given date
 * @param {string|moment.Moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The fiscal month (1-12)
 */
function calFiscalMonth(date, timezone = null, startOfWeek = constants_1.START_OF_WEEK.monday.value, fyStartMonth = constants_1.DEFAULT_FY_START_MONTH, fyStartDay = constants_1.DEFAULT_FY_START_DAY) {
    const dateMoment = moment_1.default.isMoment(date) ? date.clone() : (timezone ? moment_1.default.tz(String(date), timezone) : (0, moment_1.default)(String(date)));
    const fiscalYear = calFiscalYear(dateMoment, timezone, fyStartMonth, fyStartDay);
    const startDate = calStartDate(timezone, fiscalYear, startOfWeek, fyStartMonth, fyStartDay);
    const monthDiff = dateMoment.diff(startDate, "months");
    return monthDiff + 1;
}
