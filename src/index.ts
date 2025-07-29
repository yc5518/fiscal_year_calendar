/**
 * Fiscal Year Calendar
 * A library to generate fiscal year calendar based on custom fiscal year start date
 */

// Export types
export * from "./types";

// Export constants
export {
    START_OF_WEEK,
    CALENDAR_SYSTEMS,
    FISCAL_YEAR_PRESETS,
} from "./utils/constants";

// Export core functionality
export {
    getDayOfWeek,
    getFiscalYear,
    getTimezone,
    getStartDate,
    getEndDate,
    getWeekOptions,
    getQuarterOptions,
    getMonthOptions,
    getDateNumber,
    getFiscalQuarter,
    getFiscalMonth,
} from "./calendar/fiscalYear";

// Export new functionality
export {
    getRetailCalendarOptions,
    getBiWeeklyOptions,
    getSemiMonthlyOptions,
} from "./calendar/specialCalendars";

export {
    addHoliday,
    addHolidaySet,
    getHolidays,
    isHoliday,
    getBusinessDaysInPeriod,
} from "./calendar/holidays";

export {
    getFiscalYearToDate,
    getFiscalQuarterToDate,
    getFiscalMonthToDate,
    getDateRangeInfo,
} from "./calendar/dateRanges";

export {
    getSamePeriodLastYear,
    compareFiscalPeriods,
    getYearOverYearChange,
} from "./calendar/comparisons";

export {
    getFiscalYearWithPreset,
} from "./calendar/presets";

// Export export functionality
export {
    exportToCSV,
    exportToJSON,
    exportToICal,
    exportToHTML,
} from "./utils/exports";

// Export localization functionality
export {
    setLocale,
    getLocale,
    getAvailableLocales,
    formatLocalizedDate,
    getLocalizedMonthName,
    getLocalizedDayName,
    localizeMonthOptions,
    formatLocalizedDateRange,
    localizeWeekOptions,
    localizeQuarterOptions,
    getLocalizedQuarterName,
    AVAILABLE_LOCALES,
} from "./utils/localization";
