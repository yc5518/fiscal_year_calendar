const moment = require("moment");
require("moment-timezone");

// Default fiscal year start month (0-based, 9 = October)
const DEFAULT_FY_START_MONTH = 9;
const DEFAULT_FY_START_DAY = 1;

// With customised locale
// E.g.: when we set the first day of a week to be Sunday, 0 represents **Sunday**;
// when we set the first day of a week to be Monday, 0 represents **Monday**.
const FIRST_DAY_NUM_OF_WEEK = 0;

const REPORT_TYPE_START_OF_WEEK = Object.freeze({
    monday: {
        value: "monday",
        label: "Monday",
    },
    sunday: {
        value: "sunday",
        label: "Sunday",
    },
    saturday: {
        value: "saturday",
        label: "Saturday",
    },
});

const selectOptionStructureWithLabel = ((value, start, end) => ({
    week: String(value).toLowerCase(),
    startTime: String(start),
    endTime: String(end),
}));

/**
 * Gets the day of week number based on the start of week setting
 * @param {string} startOfWeek - The start of week setting
 * @returns {number} The day of week number (0-6)
 */
function getDayOfWeek(startOfWeek) {
    switch (startOfWeek) {
    case REPORT_TYPE_START_OF_WEEK.sunday.value:
        return 0; // Sunday
    case REPORT_TYPE_START_OF_WEEK.saturday.value:
        return 6; // Saturday
    case REPORT_TYPE_START_OF_WEEK.monday.value:
    default:
        return 1; // Monday
    }
}

/**
 * Gets the fiscal year for a given date
 * @param {string|moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The fiscal year
 */
function calFiscalYear(
    date,
    timezone = null,
    fyStartMonth = DEFAULT_FY_START_MONTH,
    fyStartDay = DEFAULT_FY_START_DAY,
) {
    const dateMoment = moment.isMoment(date) ? date.clone() : moment.tz(date, timezone);
    const month = dateMoment.month();
    const year = dateMoment.year();
    
    // If the date is before the fiscal year start date, it belongs to the previous fiscal year
    if(month < fyStartMonth || (month === fyStartMonth && dateMoment.date() < fyStartDay)) {
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
 * @returns {moment} The moment object for the current week
 */
function getCurrentWeekMoment(
    timezone = null,
    year = null,
    startOfWeek = null,
    fyStartMonth = DEFAULT_FY_START_MONTH,
    fyStartDay = DEFAULT_FY_START_DAY,
) {
    // We are actually using currentWeek to get current year
    const currentWeek = moment.tz(timezone);
    if(year) {
        currentWeek.year(year - 1);
    }

    // FY represents Fiscal Year(Financial Year)
    // dayInFirstWeek is the day must be included in first week of FY.
    const dayInFirstWeek = currentWeek.clone().month(fyStartMonth).date(fyStartDay);
    
    // startDateOfFY must be start date of the week which contains dayInFirstWeek
    const dow = getDayOfWeek(startOfWeek);
    const startDateOfFY = dayInFirstWeek.clone().weekday(FIRST_DAY_NUM_OF_WEEK);

    const firstDayOfLastYear = dayInFirstWeek.clone().month(0).startOf("month");

    // Day number of the fiscal year start date in a year, to be used in calculating `doy` in updating locale
    // `diff()` calculates the gap between two days
    const dayOfYearOfStartDateOfCurrentFY = startDateOfFY.diff(firstDayOfLastYear, "days") + 1;
    
    moment.updateLocale("facilityReportLocal", {
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
 * @returns {moment} The moment object for the timezone
 */
function getTimezone(timezone) {
    return moment.tz(timezone);
}

/**
 * Gets the start date of a fiscal year
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {moment} The start date of the fiscal year
 */
function calStartDate(
    timezone = null,
    year = null,
    fyStartMonth = DEFAULT_FY_START_MONTH,
    fyStartDay = DEFAULT_FY_START_DAY,
) {
    const currentTime = moment.tz(timezone);
    if(year) {
        currentTime.year(year);
    }

    // Get the day that must be in the first week of the fiscal year
    const dayInFirstWeek = currentTime.clone().subtract(1, "y").month(fyStartMonth).date(fyStartDay);
    
    // Get the start date of the week containing the first day of the fiscal year
    return dayInFirstWeek.clone().weekday(FIRST_DAY_NUM_OF_WEEK);
}

/**
 * Gets the end date of a fiscal year
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {moment} The end date of the fiscal year
 */
function calEndDate(
    timezone = null,
    year = null,
    fyStartMonth = DEFAULT_FY_START_MONTH,
    fyStartDay = DEFAULT_FY_START_DAY,
) {
    const currentTime = moment.tz(timezone);
    if(year) {
        currentTime.year(year);
    }

    // Get the day that must be in the first week of the next fiscal year
    const dayInFirstWeekNextYear = currentTime.clone().month(fyStartMonth).date(fyStartDay);
    
    // Get the start date of the week containing the first day of the next fiscal year
    const startDateOfNextFY = dayInFirstWeekNextYear.clone().weekday(FIRST_DAY_NUM_OF_WEEK);
    
    // The end date of the current fiscal year is the day before the start of the next fiscal year
    return startDateOfNextFY.clone().subtract(1, "day");
}

/**
 * Builds week options for a fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Array} The week options for the fiscal year
 */
function buildWeekOptions(
    startOfWeek = REPORT_TYPE_START_OF_WEEK.monday.value,
    timezone = null,
    year = null,
    fyStartMonth = DEFAULT_FY_START_MONTH,
    fyStartDay = DEFAULT_FY_START_DAY,
) {
    const startDate = calStartDate(timezone, year, fyStartMonth, fyStartDay);
    const endDate = calEndDate(timezone, year, fyStartMonth, fyStartDay);

    // Calculate the number of weeks in the fiscal year
    const diffInDays = endDate.diff(startDate, "days") + 1;
    const weeksOfCurrentFiscalYear = Math.ceil(diffInDays / 7);
    
    const weeks = [];
    for(let i = 1; i <= weeksOfCurrentFiscalYear; i++) {
        weeks.push(i);
    }
    
    const currentWeek = getCurrentWeekMoment(timezone, year, startOfWeek, fyStartMonth, fyStartDay);
    const format = "llll";
    
    return weeks.map((value) => {
        currentWeek.week(value);
        return selectOptionStructureWithLabel(
            String(value),
            currentWeek.startOf("week").format(format),
            currentWeek.endOf("week").format(format),
        );
    });
}

/**
 * Builds quarter options for a fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Array} The quarter options for the fiscal year
 */
function buildQuarterOptions(
    startOfWeek = REPORT_TYPE_START_OF_WEEK.monday.value,
    timezone = null,
    year = null,
    fyStartMonth = DEFAULT_FY_START_MONTH,
    fyStartDay = DEFAULT_FY_START_DAY,
) {
    const startDate = calStartDate(timezone, year, fyStartMonth, fyStartDay);
    const quarters = [];
    
    for(let i = 1; i <= 4; i++) {
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
 * @returns {Array} The month options for the fiscal year
 */
function buildMonthOptions(
    startOfWeek = REPORT_TYPE_START_OF_WEEK.monday.value,
    timezone = null,
    year = null,
    fyStartMonth = DEFAULT_FY_START_MONTH,
    fyStartDay = DEFAULT_FY_START_DAY,
) {
    const startDate = calStartDate(timezone, year, fyStartMonth, fyStartDay);
    const months = [];
    
    for(let i = 0; i < 12; i++) {
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
 * @param {string|moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The date number within the fiscal year
 */
function calDateNum(
    date,
    timezone = null,
    startOfWeek = REPORT_TYPE_START_OF_WEEK.monday.value,
    fyStartMonth = DEFAULT_FY_START_MONTH,
    fyStartDay = DEFAULT_FY_START_DAY,
) {
    const dateMoment = moment.isMoment(date) ? date.clone() : moment.tz(date, timezone);
    const fiscalYear = calFiscalYear(dateMoment, timezone, fyStartMonth, fyStartDay);
    const startDate = calStartDate(timezone, fiscalYear, fyStartMonth, fyStartDay);
    
    return dateMoment.diff(startDate, "days") + 1;
}

/**
 * Gets the fiscal quarter for a given date
 * @param {string|moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The fiscal quarter (1-4)
 */
function calFiscalQuarter(
    date,
    timezone = null,
    startOfWeek = REPORT_TYPE_START_OF_WEEK.monday.value,
    fyStartMonth = DEFAULT_FY_START_MONTH,
    fyStartDay = DEFAULT_FY_START_DAY,
) {
    const dateMoment = moment.isMoment(date) ? date.clone() : moment.tz(date, timezone);
    const fiscalYear = calFiscalYear(dateMoment, timezone, fyStartMonth, fyStartDay);
    const startDate = calStartDate(timezone, fiscalYear, fyStartMonth, fyStartDay);
    
    const monthDiff = dateMoment.diff(startDate, "months");
    return Math.floor(monthDiff / 3) + 1;
}

/**
 * Gets the fiscal month for a given date
 * @param {string|moment} date - The date to check
 * @param {string} timezone - The timezone
 * @param {string} startOfWeek - The start of week setting
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {number} The fiscal month (1-12)
 */
function calFiscalMonth(
    date,
    timezone = null,
    startOfWeek = REPORT_TYPE_START_OF_WEEK.monday.value,
    fyStartMonth = DEFAULT_FY_START_MONTH,
    fyStartDay = DEFAULT_FY_START_DAY,
) {
    const dateMoment = moment.isMoment(date) ? date.clone() : moment.tz(date, timezone);
    const fiscalYear = calFiscalYear(dateMoment, timezone, fyStartMonth, fyStartDay);
    const startDate = calStartDate(timezone, fiscalYear, fyStartMonth, fyStartDay);
    
    const monthDiff = dateMoment.diff(startDate, "months");
    return monthDiff + 1;
}

module.exports = {
    START_OF_WEEK: REPORT_TYPE_START_OF_WEEK, // Currently only have options of Monday, Saturday and Sunday.
    getWeekOptions: buildWeekOptions, // Given a fiscal year, returns week range options of a fiscal year
    getTimezone, // an encapsulation of moment.tz() so user doesn't have to import moment
    getQuarterOptions: buildQuarterOptions, // Given a fiscal year, returns quarter range options of a fiscal year
    getMonthOptions: buildMonthOptions, // Given a fiscal year, returns month range options of a fiscal year
    getStartDate: calStartDate, // Given a fiscal year, returns start date of a fiscal year
    getEndDate: calEndDate, // Given a fiscal year, returns end date of a fiscal year
    getDateNumber: calDateNum, // Given a date, returns a number that represents number of the date within the fiscal year
    getFiscalYear: calFiscalYear, // Given a date, returns fiscal year which may differ from calendar year
    getFiscalQuarter: calFiscalQuarter, // Given a date, returns quarter number of the fiscal year
    getFiscalMonth: calFiscalMonth, // Given a date, returns month number of the fiscal year
};
