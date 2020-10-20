const moment = require("moment");
require("moment-timezone");

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

function getCurrentWeekMoment(timezone = null, year = null, startOfWeek = null) {
    // We are actually using currentWeek to get current year
    // only do one subtraction here rather than in line 117
    const currentWeek = moment.tz(timezone);
    if(year) {
        currentWeek.year(year - 1);
    }

    // FY represents Fiscal Year(Financial Year)
    // TODO: to support customised start date of FY
    // dayInFirstWeek is the day must be included in first week of FY.
    // Some company may need October 1 to be included in first week of a fiscal year
    const dayInFirstWeek = currentWeek.clone().month(9).startOf("month");
    // startDateOfFY must be start date of the week which contains dayInFristWeek, for some companies,
    // they have Monday as 1st day of a week, so have to do see if dayInFirstWeek is Sunday to get startDateOfFY
    // TODO: Will need to do more when we have other clients who has Sunday as start of a week
    const startDateOfFY = dayInFirstWeek.clone().weekday(FIRST_DAY_NUM_OF_WEEK);

    const firstDayOfLastYear = dayInFirstWeek.clone().month(0).startOf("month");

    // Day number of Oct 1st in a year, to be used in calculating `doy` in updating locale
    // `diff()` calculates the gap between two days
    // e.g.: diff() get 2 between 1st Jan and 3rd Jan, but 3rd Jan is the 3rd day of a calenar year.
    const dayOfYearOfStartDateOfCurrentFY = startDateOfFY.diff(firstDayOfLastYear, "days") + 1;
    switch (startOfWeek) {
    case REPORT_TYPE_START_OF_WEEK.sunday.value:
        moment.updateLocale("facilityReportLocal", {
            week: {
                dow: 0, // First day of week is Sunday
                doy: 7 + 0 - dayOfYearOfStartDateOfCurrentFY, // First week of year must contain 1 January (7 + 0 - 1)
            },
        });
        break;
    case REPORT_TYPE_START_OF_WEEK.saturday.value:
        moment.updateLocale("facilityReportLocal", {
            week: {
                dow: 6, // First day of week is Saturday
                doy: 7 + 6 - dayOfYearOfStartDateOfCurrentFY, // First week of year must contain 1 January (7 + 6 - 1)
            },
        });
        break;
    case REPORT_TYPE_START_OF_WEEK.monday.value:
    default:
        moment.updateLocale("facilityReportLocal", {
            week: {
                dow: 1, // First day of week is Monday
                doy: 7 + 1 - dayOfYearOfStartDateOfCurrentFY, // First week of year must contain 4 January (7 + 1 - 10)
            },
        });
        break;
    }
    // Changed to dayInFirstWeek because it must be within the FY we want,
    // but same date of last probably is not within last FY
    dayInFirstWeek.locale("facilityReportLocal");
    return dayInFirstWeek;
}

function getTimezone(timezone) {
    return moment.tz(timezone);
}

function buildWeekOptions(timezone = null, year = null, startOfWeek = REPORT_TYPE_START_OF_WEEK.monday.value) {
    const currentTime = moment.tz(timezone);
    if(year) {
        currentTime.year(year);
    }

    const dayInFirstWeek = currentTime.clone().subtract(1, "y").month(9).startOf("month");

    // startDateOfFY must be start date of the week which contains dayInFristWeek, for some companies,
    // they have Monday as 1st day of a week, so have to do see if dayInFirstWeek is Sunday to get startDateOfFY
    // but will need to do more when we have other clients who has Sunday as start of a week
    const startDateOfFY = dayInFirstWeek.clone().weekday(FIRST_DAY_NUM_OF_WEEK);

    // endDateofFY is the day before the day of starting week of next FY
    // e.g.: if next FY start day is 28th of Sept, then end date of this FY will be 27th Sept
    // and same comment as startDateOfFY
    // eslint-disable-next-line max-len
    const startDateOfNextFY = dayInFirstWeek.clone().add(1, "y").month(9).startOf("month")
        .weekday(FIRST_DAY_NUM_OF_WEEK);

    // We have 52/53 weeks for a FY depending on a year, so need to know diffInDays for week number of a FY
    const diffInDays = startDateOfNextFY.diff(startDateOfFY, "days");
    const weeksOfCurrentFiscalYear = diffInDays / 7;
    const weeks = [];
    for(let i = 1; i <= weeksOfCurrentFiscalYear; i++) {
        weeks.push(i);
    }
    const currentWeek = getCurrentWeekMoment(timezone, year, startOfWeek);
    const format = "llll";
    return weeks.map((value) => {
        currentWeek.week(value);
        // return currentWeek.startOf("week").format(format);
        return selectOptionStructureWithLabel(String(value), currentWeek.startOf("week").format(format), currentWeek.endOf("week").format(format));
    });
}

module.exports = {
    START_OF_WEEK: REPORT_TYPE_START_OF_WEEK, // Currently only have options of Monday, Saturday and Sunday.
    getWeekOptions: buildWeekOptions, // Given a fiscal year, returns week range options of a fiscal year
    getTimezone, // an encapsulation of moment.tz() so user doesn't have to import moment
    // getQuaterOptions: buildQuaterOptions, // Given a fiscal year, returns quarter range options of a fiscal year
    // getMonthOptions: buildMonthOptions, // Given a fiscal year, returns month range options of a fiscal year
    // getStartDate: caldStartDate, // Given a fiscal year, returns start date of a fiscal year
    // getEndDate: calEndDate, // Given a fiscal year, returns end date of a fiscal year
    // getDateNumber: calDateNum, // Given a date, returns a number that represents number of the date within the fiscal year
    // getFiscalYear: calFiscalYear, // Given a date, returns fiscal year which may differ from calendar year
    // getFiscalQuater: calFiscalQuarter, // Given a date, returns quarter number of the fiscal year
    // getFiscalMonth: calFiscalMonth, // Given a date, returns month number of the fiscal year
};