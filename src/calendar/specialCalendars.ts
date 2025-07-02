/**
 * Special calendar systems like 4-4-5, 4-5-4, 5-4-4, bi-weekly, and semi-monthly
 */
import moment from "moment";
import {
    PeriodOption,
    BiWeeklyOption,
    SemiMonthlyOption,
    CalendarSystemType
} from "../types";
import {
    DEFAULT_FY_START_MONTH,
    DEFAULT_FY_START_DAY,
    START_OF_WEEK,
    CALENDAR_SYSTEMS
} from "../utils/constants";
import {
    getStartDate,
    getEndDate
} from "./fiscalYear";

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
function getRetailCalendarOptions(
    startOfWeek: string = START_OF_WEEK.monday.value,
    timezone: string | null = null,
    year: number | null = null,
    calendarSystem: CalendarSystemType = CALENDAR_SYSTEMS.RETAIL_445 as CalendarSystemType,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
): PeriodOption[] {
    const startDate = getStartDate(timezone, year, startOfWeek, fyStartMonth, fyStartDay);
    const endDate = getEndDate(timezone, year, startOfWeek, fyStartMonth, fyStartDay);
    
    const periods: PeriodOption[] = [];
    let currentDate = startDate.clone();
    let periodNumber = 1;
    
    // Determine the pattern of weeks in each period based on the calendar system
    const getWeeksInPeriod = (periodIndex: number): number => {
        const quarterIndex = Math.floor((periodIndex - 1) / 3);
        const periodInQuarter = (periodIndex - 1) % 3;
        
        switch (calendarSystem) {
        case CALENDAR_SYSTEMS.RETAIL_445:
            return periodInQuarter === 0 || periodInQuarter === 1 ? 4 : 5;
        case CALENDAR_SYSTEMS.RETAIL_454:
            return periodInQuarter === 0 || periodInQuarter === 2 ? 4 : 5;
        case CALENDAR_SYSTEMS.RETAIL_544:
            return periodInQuarter === 1 || periodInQuarter === 2 ? 4 : 5;
        default:
            return 4; // Default to 4 weeks
        }
    };
    
    // Create periods until we reach the end date
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
        const weeksInPeriod = getWeeksInPeriod(periodNumber);
        const periodStart = currentDate.clone();
        const periodEnd = currentDate.clone().add(weeksInPeriod * 7 - 1, "days");
        
        // If this period would go beyond the fiscal year, adjust the end date
        if (periodEnd.isAfter(endDate)) {
            periods.push({
                period: String(periodNumber),
                startTime: periodStart.format("llll"),
                endTime: endDate.format("llll"),
                weeks: Math.ceil(endDate.diff(periodStart, "days") / 7)
            });
            break;
        }
        
        periods.push({
            period: String(periodNumber),
            startTime: periodStart.format("llll"),
            endTime: periodEnd.format("llll"),
            weeks: weeksInPeriod
        });
        
        currentDate = periodEnd.clone().add(1, "day");
        periodNumber++;
    }
    
    return periods;
}

/**
 * Gets bi-weekly period options for a fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Array<BiWeeklyOption>} The bi-weekly period options for the fiscal year
 */
function getBiWeeklyOptions(
    startOfWeek: string = START_OF_WEEK.monday.value,
    timezone: string | null = null,
    year: number | null = null,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
): BiWeeklyOption[] {
    const startDate = getStartDate(timezone, year, startOfWeek, fyStartMonth, fyStartDay);
    const endDate = getEndDate(timezone, year, startOfWeek, fyStartMonth, fyStartDay);
    
    const biWeeklyPeriods: BiWeeklyOption[] = [];
    let currentDate = startDate.clone();
    let periodNumber = 1;
    
    // Create bi-weekly periods until we reach the end date
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
        const periodStart = currentDate.clone();
        const periodEnd = currentDate.clone().add(13, "days"); // 14 days (2 weeks) - 1
        
        // If this period would go beyond the fiscal year, adjust the end date
        if (periodEnd.isAfter(endDate)) {
            biWeeklyPeriods.push({
                period: String(periodNumber),
                startTime: periodStart.format("llll"),
                endTime: endDate.format("llll")
            });
            break;
        }
        
        biWeeklyPeriods.push({
            period: String(periodNumber),
            startTime: periodStart.format("llll"),
            endTime: periodEnd.format("llll")
        });
        
        currentDate = periodEnd.clone().add(1, "day");
        periodNumber++;
    }
    
    return biWeeklyPeriods;
}

/**
 * Gets semi-monthly period options for a fiscal year (1st and 15th of each month)
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {number} fyStartMonth - The fiscal year start month (0-based)
 * @param {number} fyStartDay - The fiscal year start day
 * @returns {Array<SemiMonthlyOption>} The semi-monthly period options for the fiscal year
 */
function getSemiMonthlyOptions(
    timezone: string | null = null,
    year: number | null = null,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
): SemiMonthlyOption[] {
    const startDate = getStartDate(timezone, year, null, fyStartMonth, fyStartDay);
    const endDate = getEndDate(timezone, year, null, fyStartMonth, fyStartDay);
    
    const semiMonthlyPeriods: SemiMonthlyOption[] = [];
    let currentDate = startDate.clone();
    let periodNumber = 1;
    
    // Create semi-monthly periods until we reach the end date
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
        const periodStart = currentDate.clone();
        let periodEnd;
        
        // If we're starting on the 1st, end on the 14th
        if (currentDate.date() === 1) {
            periodEnd = currentDate.clone().date(14);
        } 
        // If we're starting on the 15th, end on the last day of the month
        else {
            periodEnd = currentDate.clone().endOf("month");
        }
        
        // If this period would go beyond the fiscal year, adjust the end date
        if (periodEnd.isAfter(endDate)) {
            semiMonthlyPeriods.push({
                period: String(periodNumber),
                startTime: periodStart.format("llll"),
                endTime: endDate.format("llll")
            });
            break;
        }
        
        semiMonthlyPeriods.push({
            period: String(periodNumber),
            startTime: periodStart.format("llll"),
            endTime: periodEnd.format("llll")
        });
        
        // Move to the next period (either 15th or 1st of next month)
        if (currentDate.date() === 1) {
            currentDate = currentDate.clone().date(15);
        } else {
            currentDate = currentDate.clone().add(1, "month").date(1);
        }
        
        periodNumber++;
    }
    
    return semiMonthlyPeriods;
}

export {
    getRetailCalendarOptions,
    getBiWeeklyOptions,
    getSemiMonthlyOptions
};
