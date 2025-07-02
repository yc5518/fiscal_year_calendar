/**
 * TypeScript Example for fiscal-year-calendar
 */
import {
    getFiscalYear,
    getStartDate,
    getEndDate,
    getWeekOptions,
    getQuarterOptions,
    getMonthOptions,
    getRetailCalendarOptions,
    getBiWeeklyOptions,
    getSemiMonthlyOptions,
    addHoliday,
    addHolidaySet,
    getHolidays,
    isHoliday,
    getBusinessDaysInPeriod,
    getFiscalYearToDate,
    getFiscalQuarterToDate,
    getFiscalMonthToDate,
    getDateRangeInfo,
    getSamePeriodLastYear,
    compareFiscalPeriods,
    getYearOverYearChange,
    getFiscalYearWithPreset,
    START_OF_WEEK,
    CALENDAR_SYSTEMS,
    FISCAL_YEAR_PRESETS
} from '../src';

// Example 1: Basic fiscal year information
console.log("\n=== Example 1: Basic Fiscal Year Information ===");
const today = new Date().toISOString();
const fiscalYear = getFiscalYear(today);
console.log(`Current date: ${today}`);
console.log(`Fiscal year: ${fiscalYear}`);

const startDate = getStartDate(null, fiscalYear);
const endDate = getEndDate(null, fiscalYear);
console.log(`Fiscal year start date: ${startDate.format("YYYY-MM-DD")}`);
console.log(`Fiscal year end date: ${endDate.format("YYYY-MM-DD")}`);

// Example 2: Week, quarter, and month options
console.log("\n=== Example 2: Week, Quarter, and Month Options ===");
const weeks = getWeekOptions(START_OF_WEEK.monday.value, null, fiscalYear);
console.log(`Total weeks in fiscal year ${fiscalYear}: ${weeks.length}`);
console.log(`First week: ${weeks[0].week}, ${weeks[0].startTime} to ${weeks[0].endTime}`);
console.log(`Last week: ${weeks[weeks.length - 1].week}, ${weeks[weeks.length - 1].startTime} to ${weeks[weeks.length - 1].endTime}`);

const quarters = getQuarterOptions(START_OF_WEEK.monday.value, null, fiscalYear);
console.log(`\nQuarters in fiscal year ${fiscalYear}:`);
quarters.forEach(q => {
    console.log(`Quarter ${q.quarter}: ${new Date(q.startTime).toDateString()} to ${new Date(q.endTime).toDateString()}`);
});

const months = getMonthOptions(START_OF_WEEK.monday.value, null, fiscalYear);
console.log(`\nFirst 3 months in fiscal year ${fiscalYear}:`);
months.slice(0, 3).forEach(m => {
    console.log(`Month ${m.month} (${m.name}): ${new Date(m.startTime).toDateString()} to ${new Date(m.endTime).toDateString()}`);
});

// Example 3: Special calendar systems
console.log("\n=== Example 3: Special Calendar Systems ===");
const retailCalendar = getRetailCalendarOptions(
    START_OF_WEEK.monday.value,
    null,
    fiscalYear,
    CALENDAR_SYSTEMS.RETAIL_445 as any
);
console.log(`4-4-5 Calendar periods: ${retailCalendar.length}`);
console.log(`First period: ${retailCalendar[0].period}, ${new Date(retailCalendar[0].startTime).toDateString()} to ${new Date(retailCalendar[0].endTime).toDateString()}, ${retailCalendar[0].weeks} weeks`);

const biWeekly = getBiWeeklyOptions(START_OF_WEEK.monday.value, null, fiscalYear);
console.log(`\nBi-weekly periods: ${biWeekly.length}`);
console.log(`First period: ${biWeekly[0].period}, ${new Date(biWeekly[0].startTime).toDateString()} to ${new Date(biWeekly[0].endTime).toDateString()}`);

const semiMonthly = getSemiMonthlyOptions(null, fiscalYear);
console.log(`\nSemi-monthly periods: ${semiMonthly.length}`);
console.log(`First period: ${semiMonthly[0].period}, ${new Date(semiMonthly[0].startTime).toDateString()} to ${new Date(semiMonthly[0].endTime).toDateString()}`);

// Example 4: Holiday management
console.log("\n=== Example 4: Holiday Management ===");
addHoliday("2025-01-01", "New Year's Day", true);
addHoliday("2025-12-25", "Christmas Day", true);
console.log("Added holidays: New Year's Day and Christmas Day");

const usHolidays = addHolidaySet("US");
console.log(`Added US holiday set with ${usHolidays.length} holidays`);

const holidays = getHolidays();
console.log(`Total holidays registered: ${holidays.length}`);

const isNewYearHoliday = isHoliday("2025-01-01");
console.log(`Is 2025-01-01 a holiday? ${isNewYearHoliday}`);

const businessDays = getBusinessDaysInPeriod("2025-01-01", "2025-01-31");
console.log(`Business days in January 2025: ${businessDays}`);

// Example 5: Date range utilities
console.log("\n=== Example 5: Date Range Utilities ===");
const ytd = getFiscalYearToDate(today);
console.log(`Fiscal year-to-date: ${ytd.startDate.format("YYYY-MM-DD")} to ${ytd.endDate.format("YYYY-MM-DD")}`);

const qtd = getFiscalQuarterToDate(today);
console.log(`Fiscal quarter-to-date: ${qtd.startDate.format("YYYY-MM-DD")} to ${qtd.endDate.format("YYYY-MM-DD")}`);

const mtd = getFiscalMonthToDate(today);
console.log(`Fiscal month-to-date: ${mtd.startDate.format("YYYY-MM-DD")} to ${mtd.endDate.format("YYYY-MM-DD")}`);

const dateRangeInfo = getDateRangeInfo("2025-01-01", "2025-03-31");
console.log(`\nDate range info for Q1 2025:`);
console.log(`- Fiscal year: ${dateRangeInfo.fiscalYear}`);
console.log(`- Total days: ${dateRangeInfo.totalDays}`);
console.log(`- Business days: ${dateRangeInfo.totalBusinessDays}`);
console.log(`- Weeks: ${dateRangeInfo.weeks.length}`);
console.log(`- Months: ${dateRangeInfo.months.length}`);
console.log(`- Quarters: ${dateRangeInfo.quarters.length}`);

// Example 6: Period comparisons
console.log("\n=== Example 6: Period Comparisons ===");
const samePeriod = getSamePeriodLastYear(today, "month");
console.log(`Same month last year: Current - ${samePeriod.currentPeriod.format("YYYY-MM-DD")}, Previous - ${samePeriod.previousPeriod.format("YYYY-MM-DD")}`);

const period1 = {
    startDate: getStartDate(null, fiscalYear),
    endDate: getEndDate(null, fiscalYear)
};

const period2 = {
    startDate: getStartDate(null, fiscalYear - 1),
    endDate: getEndDate(null, fiscalYear - 1)
};

const comparison = compareFiscalPeriods(period1, period2);
console.log(`\nComparison of fiscal years ${fiscalYear} and ${fiscalYear - 1}:`);
console.log(`- Days difference: ${comparison.daysDiff}`);
console.log(`- Current fiscal year days: ${comparison.period1Days}`);
console.log(`- Previous fiscal year days: ${comparison.period2Days}`);
console.log(`- Current fiscal year weekdays: ${comparison.period1WeekdayCount}`);
console.log(`- Previous fiscal year weekdays: ${comparison.period2WeekdayCount}`);

const yoy = getYearOverYearChange(120, 100, `FY${fiscalYear}`, `FY${fiscalYear - 1}`);
console.log(`\nYear-over-year change from ${yoy.previousPeriod} to ${yoy.currentPeriod}:`);
console.log(`- Absolute change: ${yoy.absoluteChange}`);
console.log(`- Percentage change: ${yoy.percentageChange.toFixed(2)}%`);

// Example 7: Fiscal year presets
console.log("\n=== Example 7: Fiscal Year Presets ===");
const presets = Object.keys(FISCAL_YEAR_PRESETS);
console.log(`Available presets: ${presets.join(", ")}`);

const usPreset = getFiscalYearWithPreset("us-federal");
console.log(`\nUS Federal Government fiscal year:`);
console.log(`- Name: ${usPreset.preset.name}`);
console.log(`- Description: ${usPreset.preset.description}`);
console.log(`- Start month: ${usPreset.preset.fyStartMonth}`);
console.log(`- Start day: ${usPreset.preset.fyStartDay}`);
console.log(`- Start date: ${usPreset.startDate.format("YYYY-MM-DD")}`);
console.log(`- End date: ${usPreset.endDate.format("YYYY-MM-DD")}`);
console.log(`- Weeks: ${usPreset.weeks.length}`);
console.log(`- Quarters: ${usPreset.quarters.length}`);
console.log(`- Months: ${usPreset.months.length}`);

const auPreset = getFiscalYearWithPreset("australia");
console.log(`\nAustralian fiscal year:`);
console.log(`- Name: ${auPreset.preset.name}`);
console.log(`- Description: ${auPreset.preset.description}`);
console.log(`- Start date: ${auPreset.startDate.format("YYYY-MM-DD")}`);
console.log(`- End date: ${auPreset.endDate.format("YYYY-MM-DD")}`);
