/**
 * Fiscal year comparison utilities
 */
import moment from "moment";
import { YearOverYearChange, PeriodType } from "../types";
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
function getSamePeriodLastYear(
    date: string | moment.Moment,
    periodType: PeriodType = "day",
    timezone: string | null = null,
    startOfWeek: string = START_OF_WEEK.monday.value,
    fyStartMonth: number = DEFAULT_FY_START_MONTH,
    fyStartDay: number = DEFAULT_FY_START_DAY,
): { currentPeriod: moment.Moment; previousPeriod: moment.Moment } {
    const dateMoment = moment.isMoment(date) ? date.clone() : moment(date);
    const fiscalYear = getFiscalYear(dateMoment, timezone, fyStartMonth, fyStartDay);
    const previousFiscalYear = fiscalYear - 1;
    
    // For day, simply subtract a year
    if (periodType === "day") {
        return {
            currentPeriod: dateMoment.clone(),
            previousPeriod: dateMoment.clone().subtract(1, "year")
        };
    }
    
    // For week, month, quarter, or year, we need to calculate the relative position
    // within the fiscal year and then find the same position in the previous fiscal year
    
    // Get the start date of the current fiscal year
    const fyStartDate = getStartDate(timezone, fiscalYear, startOfWeek, fyStartMonth, fyStartDay);
    
    // Get the start date of the previous fiscal year
    const prevFyStartDate = getStartDate(timezone, previousFiscalYear, startOfWeek, fyStartMonth, fyStartDay);
    
    let currentPeriodStart: moment.Moment;
    let currentPeriodEnd: moment.Moment;
    let previousPeriodStart: moment.Moment;
    let previousPeriodEnd: moment.Moment;
    
    switch (periodType) {
    case "week":
        // Calculate the week number within the fiscal year
        const weekDiff = Math.floor(dateMoment.diff(fyStartDate, "days") / 7);
        
        // Get the same week in the previous fiscal year
        currentPeriodStart = dateMoment.clone().startOf("week");
        currentPeriodEnd = dateMoment.clone().endOf("week");
        previousPeriodStart = prevFyStartDate.clone().add(weekDiff * 7, "days");
        previousPeriodEnd = previousPeriodStart.clone().add(6, "days");
        break;
        
    case "month":
        // Get the fiscal month
        const fiscalMonth = getFiscalMonth(dateMoment, timezone, startOfWeek, fyStartMonth, fyStartDay);
        
        // Get the same month in the previous fiscal year
        currentPeriodStart = fyStartDate.clone().add(fiscalMonth - 1, "months");
        currentPeriodEnd = currentPeriodStart.clone().endOf("month");
        previousPeriodStart = prevFyStartDate.clone().add(fiscalMonth - 1, "months");
        previousPeriodEnd = previousPeriodStart.clone().endOf("month");
        break;
        
    case "quarter":
        // Get the fiscal quarter
        const fiscalQuarter = getFiscalQuarter(dateMoment, timezone, startOfWeek, fyStartMonth, fyStartDay);
        
        // Get the same quarter in the previous fiscal year
        currentPeriodStart = fyStartDate.clone().add((fiscalQuarter - 1) * 3, "months");
        currentPeriodEnd = currentPeriodStart.clone().add(3, "months").subtract(1, "day");
        previousPeriodStart = prevFyStartDate.clone().add((fiscalQuarter - 1) * 3, "months");
        previousPeriodEnd = previousPeriodStart.clone().add(3, "months").subtract(1, "day");
        break;
        
    case "year":
        // Get the full fiscal year
        currentPeriodStart = fyStartDate.clone();
        currentPeriodEnd = getEndDate(timezone, fiscalYear, startOfWeek, fyStartMonth, fyStartDay);
        previousPeriodStart = prevFyStartDate.clone();
        previousPeriodEnd = getEndDate(timezone, previousFiscalYear, startOfWeek, fyStartMonth, fyStartDay);
        break;
        
    case "biweekly":
        // Calculate the biweekly period number within the fiscal year
        const biweeklyDiff = Math.floor(dateMoment.diff(fyStartDate, "days") / 14);
        
        // Get the same biweekly period in the previous fiscal year
        currentPeriodStart = fyStartDate.clone().add(biweeklyDiff * 14, "days");
        currentPeriodEnd = currentPeriodStart.clone().add(13, "days");
        previousPeriodStart = prevFyStartDate.clone().add(biweeklyDiff * 14, "days");
        previousPeriodEnd = previousPeriodStart.clone().add(13, "days");
        break;
        
    case "semimonthly":
        // For semi-monthly, we need to determine if we're in the first or second half of the month
        const isFirstHalf = dateMoment.date() <= 15;
        const monthOffset = dateMoment.diff(fyStartDate, "months");
        
        // Get the same semi-monthly period in the previous fiscal year
        if (isFirstHalf) {
            currentPeriodStart = fyStartDate.clone().add(monthOffset, "months").date(1);
            currentPeriodEnd = currentPeriodStart.clone().date(15);
            previousPeriodStart = prevFyStartDate.clone().add(monthOffset, "months").date(1);
            previousPeriodEnd = previousPeriodStart.clone().date(15);
        } else {
            currentPeriodStart = fyStartDate.clone().add(monthOffset, "months").date(16);
            currentPeriodEnd = currentPeriodStart.clone().endOf("month");
            previousPeriodStart = prevFyStartDate.clone().add(monthOffset, "months").date(16);
            previousPeriodEnd = previousPeriodStart.clone().endOf("month");
        }
        break;
        
    default:
        // Default to day
        return {
            currentPeriod: dateMoment.clone(),
            previousPeriod: dateMoment.clone().subtract(1, "year")
        };
    }
    
    // If the current date is within the calculated period, adjust to the current date
    if (dateMoment.isBefore(currentPeriodEnd)) {
        currentPeriodEnd = dateMoment.clone();
        
        // Calculate the days from period start to current date
        const daysFromStart = dateMoment.diff(currentPeriodStart, "days");
        
        // Adjust the previous period end date accordingly
        previousPeriodEnd = previousPeriodStart.clone().add(daysFromStart, "days");
    }
    
    return {
        currentPeriod: dateMoment.clone(),
        previousPeriod: previousPeriodStart.clone().add(dateMoment.diff(currentPeriodStart, "days"), "days")
    };
}

/**
 * Compares two fiscal periods
 * @param {Object} period1 - The first period
 * @param {Object} period2 - The second period
 * @returns {Object} The comparison result
 */
function compareFiscalPeriods(
    period1: { startDate: moment.Moment; endDate: moment.Moment },
    period2: { startDate: moment.Moment; endDate: moment.Moment }
): {
    daysDiff: number;
    period1Days: number;
    period2Days: number;
    period1WeekdayCount: number;
    period2WeekdayCount: number;
} {
    // Calculate the number of days in each period
    const period1Days = period1.endDate.diff(period1.startDate, "days") + 1;
    const period2Days = period2.endDate.diff(period2.startDate, "days") + 1;
    
    // Calculate the difference in days
    const daysDiff = period1Days - period2Days;
    
    // Count weekdays in each period
    let period1WeekdayCount = 0;
    let period2WeekdayCount = 0;
    
    // Count weekdays in period 1
    const current1 = period1.startDate.clone();
    while (current1.isSameOrBefore(period1.endDate, "day")) {
        if (current1.day() !== 0 && current1.day() !== 6) {
            period1WeekdayCount++;
        }
        current1.add(1, "day");
    }
    
    // Count weekdays in period 2
    const current2 = period2.startDate.clone();
    while (current2.isSameOrBefore(period2.endDate, "day")) {
        if (current2.day() !== 0 && current2.day() !== 6) {
            period2WeekdayCount++;
        }
        current2.add(1, "day");
    }
    
    return {
        daysDiff,
        period1Days,
        period2Days,
        period1WeekdayCount,
        period2WeekdayCount
    };
}

/**
 * Calculates the year-over-year change between two values
 * @param {number} currentValue - The current value
 * @param {number} previousValue - The previous value
 * @param {string} currentPeriod - The current period description
 * @param {string} previousPeriod - The previous period description
 * @returns {YearOverYearChange} The year-over-year change
 */
function getYearOverYearChange(
    currentValue: number,
    previousValue: number,
    currentPeriod: string = "Current Period",
    previousPeriod: string = "Previous Period"
): YearOverYearChange {
    const absoluteChange = currentValue - previousValue;
    const percentageChange = previousValue !== 0 
        ? (absoluteChange / Math.abs(previousValue)) * 100 
        : (currentValue === 0 ? 0 : 100);
    
    return {
        currentPeriod,
        previousPeriod,
        absoluteChange,
        percentageChange
    };
}

export {
    getSamePeriodLastYear,
    compareFiscalPeriods,
    getYearOverYearChange
};
