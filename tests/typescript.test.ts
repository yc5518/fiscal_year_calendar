/**
 * TypeScript implementation tests
 */
import moment from "moment";
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
} from "../src";

describe("TypeScript Implementation Tests", () => {
    test("Core functions should work correctly", () => {
        const date = new Date().toISOString();
        const fiscalYear = getFiscalYear(date);
        
        expect(fiscalYear).toBeDefined();
        expect(typeof fiscalYear).toBe("number");
        
        const startDate = getStartDate(null, fiscalYear);
        const endDate = getEndDate(null, fiscalYear);
        
        expect(moment.isMoment(startDate)).toBe(true);
        expect(moment.isMoment(endDate)).toBe(true);
        expect(endDate.isAfter(startDate)).toBe(true);
    });
    
    test("Calendar options should be generated correctly", () => {
        const weeks = getWeekOptions();
        const quarters = getQuarterOptions();
        const months = getMonthOptions();
        
        expect(Array.isArray(weeks)).toBe(true);
        expect(Array.isArray(quarters)).toBe(true);
        expect(Array.isArray(months)).toBe(true);
        
        expect(weeks.length).toBeGreaterThan(0);
        expect(quarters.length).toBe(4);
        expect(months.length).toBe(12);
    });
    
    test("Special calendar systems should work correctly", () => {
        const retailCalendar = getRetailCalendarOptions();
        const biWeekly = getBiWeeklyOptions();
        const semiMonthly = getSemiMonthlyOptions();
        
        expect(Array.isArray(retailCalendar)).toBe(true);
        expect(Array.isArray(biWeekly)).toBe(true);
        expect(Array.isArray(semiMonthly)).toBe(true);
        
        expect(retailCalendar.length).toBeGreaterThan(0);
        expect(biWeekly.length).toBeGreaterThan(0);
        expect(semiMonthly.length).toBeGreaterThan(0);
    });
    
    test("Holiday functions should work correctly", () => {
        const holiday = addHoliday("2025-01-01", "New Year's Day", true);
        
        expect(holiday).toBeDefined();
        expect(holiday.name).toBe("New Year's Day");
        expect(holiday.recurring).toBe(true);
        
        const holidays = getHolidays();
        expect(Array.isArray(holidays)).toBe(true);
        expect(holidays.length).toBeGreaterThan(0);
        
        const isNewYearHoliday = isHoliday("2025-01-01");
        expect(isNewYearHoliday).toBe(true);
        
        const businessDays = getBusinessDaysInPeriod("2025-01-01", "2025-01-31");
        expect(typeof businessDays).toBe("number");
    });
    
    test("Date range functions should work correctly", () => {
        const date = new Date().toISOString();
        const ytd = getFiscalYearToDate(date);
        const qtd = getFiscalQuarterToDate(date);
        const mtd = getFiscalMonthToDate(date);
        
        expect(ytd).toBeDefined();
        expect(qtd).toBeDefined();
        expect(mtd).toBeDefined();
        
        expect(moment.isMoment(ytd.startDate)).toBe(true);
        expect(moment.isMoment(ytd.endDate)).toBe(true);
        
        const dateRangeInfo = getDateRangeInfo("2025-01-01", "2025-12-31");
        expect(dateRangeInfo).toBeDefined();
        expect(dateRangeInfo.totalDays).toBe(365);
    });
    
    test("Comparison functions should work correctly", () => {
        const date = new Date().toISOString();
        const samePeriod = getSamePeriodLastYear(date);
        
        expect(samePeriod).toBeDefined();
        expect(moment.isMoment(samePeriod.currentPeriod)).toBe(true);
        expect(moment.isMoment(samePeriod.previousPeriod)).toBe(true);
        
        const period1 = {
            startDate: moment("2025-01-01"),
            endDate: moment("2025-01-31")
        };
        
        const period2 = {
            startDate: moment("2024-01-01"),
            endDate: moment("2024-01-31")
        };
        
        const comparison = compareFiscalPeriods(period1, period2);
        expect(comparison).toBeDefined();
        expect(typeof comparison.daysDiff).toBe("number");
        
        const yoy = getYearOverYearChange(100, 90);
        expect(yoy).toBeDefined();
        expect(yoy.absoluteChange).toBe(10);
        expect(yoy.percentageChange).toBe(100 * 10 / 90);
    });
    
    test("Preset functions should work correctly", () => {
        const usPreset = getFiscalYearWithPreset("us-federal");
        
        expect(usPreset).toBeDefined();
        expect(usPreset.preset).toBeDefined();
        expect(usPreset.preset.name).toBe("US Federal Government");
        expect(usPreset.preset.fyStartMonth).toBe(9); // October
        expect(usPreset.preset.fyStartDay).toBe(1);
        
        expect(moment.isMoment(usPreset.startDate)).toBe(true);
        expect(moment.isMoment(usPreset.endDate)).toBe(true);
        expect(Array.isArray(usPreset.weeks)).toBe(true);
        expect(Array.isArray(usPreset.quarters)).toBe(true);
        expect(Array.isArray(usPreset.months)).toBe(true);
    });
    
    test("Constants should be defined correctly", () => {
        expect(START_OF_WEEK).toBeDefined();
        expect(START_OF_WEEK.monday).toBeDefined();
        expect(START_OF_WEEK.sunday).toBeDefined();
        expect(START_OF_WEEK.saturday).toBeDefined();
        
        expect(CALENDAR_SYSTEMS).toBeDefined();
        expect(CALENDAR_SYSTEMS.STANDARD).toBe("standard");
        expect(CALENDAR_SYSTEMS.RETAIL_445).toBe("4-4-5");
        expect(CALENDAR_SYSTEMS.RETAIL_454).toBe("4-5-4");
        expect(CALENDAR_SYSTEMS.RETAIL_544).toBe("5-4-4");
        
        expect(FISCAL_YEAR_PRESETS).toBeDefined();
        expect(FISCAL_YEAR_PRESETS["us-federal"]).toBeDefined();
        expect(FISCAL_YEAR_PRESETS["calendar-year"]).toBeDefined();
    });
});
