/**
 * Core fiscal year calendar functionality using date-fns
 */
import {
    addDays,
    addMonths,
    differenceInDays,
    differenceInMonths,
    getDate,
    getMonth,
    getYear,
    setDate,
    setMonth,
    setYear,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    format
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import {
    WeekOption,
    QuarterOption,
    MonthOption,
    FiscalYearConfig,
    CalendarSystemType
} from "../types";
import {
    DEFAULT_FY_START_MONTH,
    DEFAULT_FY_START_DAY,
    FIRST_DAY_NUM_OF_WEEK,
    START_OF_WEEK,
    CALENDAR_SYSTEMS
} from "../utils/constants";
import {
    DateInput,
    toDateObject,
    createDate,
    cloneDate,
    formatDate,
    addTime,
    subtractTime,
    getDateDifference,
    getStartOfPeriod,
    getEndOfPeriod,
    getDateProperty
} from "../utils/dateUtils";

/**
 * Gets the day of week number based on the start of week setting
 * @param {string} startOfWeek - The start of week setting
 * @returns {number} The day of week number (0-6)
 */
function getDayOfWeek(startOfWeek: string): number {
    switch (startOfWeek) {
    case START_OF_WEEK.sunday.value:
        return 0; // Sunday
    case START_OF_WEEK.saturday.value:
        return 6; // Saturday
    case START_OF_WEEK.monday.value:
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
function getFiscalYear(
    date: DateInput,
    timezone: string | null = null,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
): number {
    const dateObj = toDateObject(date, timezone || undefined);
    const month = getMonth(dateObj);
    const year = getYear(dateObj);
    
    // If the date is before the fiscal year start date, it belongs to the previous fiscal year
    if (month < fyStartMonth || (month === fyStartMonth && getDate(dateObj) < fyStartDay)) {
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
function getCurrentWeekDate(
    timezone: string | null = null,
    year: number | null = null,
    weekStartDay: string | null = null,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
): Date {
    // We are actually using currentWeek to get current year
    let currentWeek = createDate(undefined, timezone || undefined);
    if (year) {
        currentWeek = setYear(currentWeek, year - 1);
    }

    // FY represents Fiscal Year(Financial Year)
    // dayInFirstWeek is the day must be included in first week of FY.
    let dayInFirstWeek = cloneDate(currentWeek);
    dayInFirstWeek = setMonth(dayInFirstWeek, fyStartMonth);
    dayInFirstWeek = setDate(dayInFirstWeek, fyStartDay);
    
    // startDateOfFY must be start date of the week which contains dayInFirstWeek
    const dow = getDayOfWeek(weekStartDay || START_OF_WEEK.monday.value) as 0 | 1 | 6;
    const startDateOfFY = startOfWeek(dayInFirstWeek, { weekStartsOn: dow });

    return dayInFirstWeek;
}

/**
 * Gets a date object for the specified timezone
 * @param {string} timezone - The timezone
 * @returns {Date} The date object for the timezone
 */
function getTimezone(timezone?: string): Date {
    return createDate(undefined, timezone);
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
function getStartDate(
    timezone: string | null = null,
    year: number | null = null,
    weekStartDay: string | null = null,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
): Date {
    let currentTime = createDate(undefined, timezone || undefined);
    if (year) {
        currentTime = setYear(currentTime, year);
    }

    // Get the day that must be in the first week of the fiscal year
    let dayInFirstWeek = cloneDate(currentTime);
    dayInFirstWeek = subtractTime(dayInFirstWeek, 1, 'years');
    dayInFirstWeek = setMonth(dayInFirstWeek, fyStartMonth);
    dayInFirstWeek = setDate(dayInFirstWeek, fyStartDay);
    
    // Get the start date of the week containing the first day of the fiscal year
    const dow = getDayOfWeek(weekStartDay || START_OF_WEEK.monday.value) as 0 | 1 | 6;
    return startOfWeek(dayInFirstWeek, { weekStartsOn: dow });
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
function getEndDate(
    timezone: string | null = null,
    year: number | null = null,
    weekStartDay: string | null = null,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
): Date {
    let currentTime = createDate(undefined, timezone || undefined);
    if (year) {
        currentTime = setYear(currentTime, year);
    }

    // Get the day that must be in the first week of the next fiscal year
    let dayInFirstWeekNextYear = cloneDate(currentTime);
    dayInFirstWeekNextYear = setMonth(dayInFirstWeekNextYear, fyStartMonth);
    dayInFirstWeekNextYear = setDate(dayInFirstWeekNextYear, fyStartDay);
    
    // Get the start date of the week containing the first day of the next fiscal year
    const dow = getDayOfWeek(weekStartDay || START_OF_WEEK.monday.value) as 0 | 1 | 6;
    const startDateOfNextFY = startOfWeek(dayInFirstWeekNextYear, { weekStartsOn: dow });
    
    // The end date of the current fiscal year is the day before the start of the next fiscal year
    return subtractTime(startDateOfNextFY, 1, 'days');
}

/**
 * Helper function to create a week option structure
 * @param {string} value - The week number
 * @param {Date} start - The start date
 * @param {Date} end - The end date
 * @returns {WeekOption} The week option structure
 */
function createWeekOption(
    value: string | number,
    start: Date,
    end: Date
): WeekOption {
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
function getWeekOptions(
    weekStartDay: string = START_OF_WEEK.monday.value,
    timezone: string | null = null,
    year: number | null = null,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
    calendarSystem: CalendarSystemType = CALENDAR_SYSTEMS.STANDARD as CalendarSystemType,
): WeekOption[] {
    const startDateObj = getStartDate(timezone, year, weekStartDay, fyStartMonth, fyStartDay);
    const endDateObj = getEndDate(timezone, year, weekStartDay, fyStartMonth, fyStartDay);

    // Calculate the number of weeks in the fiscal year
    const diffInDays = differenceInDays(endDateObj, startDateObj) + 1;
    const weeksOfCurrentFiscalYear = Math.ceil(diffInDays / 7);
    
    const weeks: WeekOption[] = [];
    const dow = getDayOfWeek(weekStartDay) as 0 | 1 | 6;
    
    for (let i = 0; i < weeksOfCurrentFiscalYear; i++) {
        const weekStart = addDays(startDateObj, i * 7);
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: dow });
        
        weeks.push(createWeekOption(
            i + 1,
            weekStart,
            weekEnd
        ));
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
function getQuarterOptions(
    weekStartDay: string = START_OF_WEEK.monday.value,
    timezone: string | null = null,
    year: number | null = null,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
    calendarSystem: CalendarSystemType = CALENDAR_SYSTEMS.STANDARD as CalendarSystemType,
): QuarterOption[] {
    const startDateObj = getStartDate(timezone, year, weekStartDay, fyStartMonth, fyStartDay);
    const quarters: QuarterOption[] = [];
    
    for (let i = 0; i < 4; i++) {
        const quarterStart = addMonths(startDateObj, i * 3);
        const quarterEnd = addDays(addMonths(quarterStart, 3), -1);
        
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
function getMonthOptions(
    weekStartDay: string = START_OF_WEEK.monday.value,
    timezone: string | null = null,
    year: number | null = null,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
    calendarSystem: CalendarSystemType = CALENDAR_SYSTEMS.STANDARD as CalendarSystemType,
): MonthOption[] {
    const startDateObj = getStartDate(timezone, year, weekStartDay, fyStartMonth, fyStartDay);
    const months: MonthOption[] = [];
    
    for (let i = 0; i < 12; i++) {
        const monthStart = addMonths(startDateObj, i);
        const monthEnd = endOfMonth(monthStart);
        
        months.push({
            month: String(i + 1),
            name: format(monthStart, 'MMMM'),
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
function getDateNumber(
    date: DateInput,
    timezone: string | null = null,
    weekStartDay: string = START_OF_WEEK.monday.value,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
): number {
    const dateObj = toDateObject(date, timezone || undefined);
    const fiscalYear = getFiscalYear(dateObj, timezone, fyStartMonth, fyStartDay);
    const startDateObj = getStartDate(timezone, fiscalYear, weekStartDay, fyStartMonth, fyStartDay);
    
    return differenceInDays(dateObj, startDateObj) + 1;
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
function getFiscalQuarter(
    date: DateInput,
    timezone: string | null = null,
    weekStartDay: string = START_OF_WEEK.monday.value,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
): number {
    const dateObj = toDateObject(date, timezone || undefined);
    const fiscalYear = getFiscalYear(dateObj, timezone, fyStartMonth, fyStartDay);
    const startDateObj = getStartDate(timezone, fiscalYear, weekStartDay, fyStartMonth, fyStartDay);
    
    const monthDiff = differenceInMonths(dateObj, startDateObj);
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
function getFiscalMonth(
    date: DateInput,
    timezone: string | null = null,
    weekStartDay: string = START_OF_WEEK.monday.value,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
): number {
    const dateObj = toDateObject(date, timezone || undefined);
    const fiscalYear = getFiscalYear(dateObj, timezone, fyStartMonth, fyStartDay);
    const startDateObj = getStartDate(timezone, fiscalYear, weekStartDay, fyStartMonth, fyStartDay);
    
    const monthDiff = differenceInMonths(dateObj, startDateObj);
    return monthDiff + 1;
}

export {
    getDayOfWeek,
    getFiscalYear,
    getCurrentWeekDate,
    getTimezone,
    getStartDate,
    getEndDate,
    getWeekOptions,
    getQuarterOptions,
    getMonthOptions,
    getDateNumber,
    getFiscalQuarter,
    getFiscalMonth,
};
