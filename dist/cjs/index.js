"use strict";
/**
 * Fiscal Year Calendar
 * A library to generate fiscal year calendar based on custom fiscal year start date
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiscalYearWithPreset = exports.getYearOverYearChange = exports.compareFiscalPeriods = exports.getSamePeriodLastYear = exports.getDateRangeInfo = exports.getFiscalMonthToDate = exports.getFiscalQuarterToDate = exports.getFiscalYearToDate = exports.getBusinessDaysInPeriod = exports.isHoliday = exports.getHolidays = exports.addHolidaySet = exports.addHoliday = exports.getSemiMonthlyOptions = exports.getBiWeeklyOptions = exports.getRetailCalendarOptions = exports.getFiscalMonth = exports.getFiscalQuarter = exports.getDateNumber = exports.getMonthOptions = exports.getQuarterOptions = exports.getWeekOptions = exports.getEndDate = exports.getStartDate = exports.getTimezone = exports.getFiscalYear = exports.getDayOfWeek = exports.FISCAL_YEAR_PRESETS = exports.CALENDAR_SYSTEMS = exports.START_OF_WEEK = void 0;
// Export types
__exportStar(require("./types"), exports);
// Export constants
var constants_1 = require("./utils/constants");
Object.defineProperty(exports, "START_OF_WEEK", { enumerable: true, get: function () { return constants_1.START_OF_WEEK; } });
Object.defineProperty(exports, "CALENDAR_SYSTEMS", { enumerable: true, get: function () { return constants_1.CALENDAR_SYSTEMS; } });
Object.defineProperty(exports, "FISCAL_YEAR_PRESETS", { enumerable: true, get: function () { return constants_1.FISCAL_YEAR_PRESETS; } });
// Export core functionality
var fiscalYear_1 = require("./calendar/fiscalYear");
Object.defineProperty(exports, "getDayOfWeek", { enumerable: true, get: function () { return fiscalYear_1.getDayOfWeek; } });
Object.defineProperty(exports, "getFiscalYear", { enumerable: true, get: function () { return fiscalYear_1.getFiscalYear; } });
Object.defineProperty(exports, "getTimezone", { enumerable: true, get: function () { return fiscalYear_1.getTimezone; } });
Object.defineProperty(exports, "getStartDate", { enumerable: true, get: function () { return fiscalYear_1.getStartDate; } });
Object.defineProperty(exports, "getEndDate", { enumerable: true, get: function () { return fiscalYear_1.getEndDate; } });
Object.defineProperty(exports, "getWeekOptions", { enumerable: true, get: function () { return fiscalYear_1.getWeekOptions; } });
Object.defineProperty(exports, "getQuarterOptions", { enumerable: true, get: function () { return fiscalYear_1.getQuarterOptions; } });
Object.defineProperty(exports, "getMonthOptions", { enumerable: true, get: function () { return fiscalYear_1.getMonthOptions; } });
Object.defineProperty(exports, "getDateNumber", { enumerable: true, get: function () { return fiscalYear_1.getDateNumber; } });
Object.defineProperty(exports, "getFiscalQuarter", { enumerable: true, get: function () { return fiscalYear_1.getFiscalQuarter; } });
Object.defineProperty(exports, "getFiscalMonth", { enumerable: true, get: function () { return fiscalYear_1.getFiscalMonth; } });
// Export new functionality
var specialCalendars_1 = require("./calendar/specialCalendars");
Object.defineProperty(exports, "getRetailCalendarOptions", { enumerable: true, get: function () { return specialCalendars_1.getRetailCalendarOptions; } });
Object.defineProperty(exports, "getBiWeeklyOptions", { enumerable: true, get: function () { return specialCalendars_1.getBiWeeklyOptions; } });
Object.defineProperty(exports, "getSemiMonthlyOptions", { enumerable: true, get: function () { return specialCalendars_1.getSemiMonthlyOptions; } });
var holidays_1 = require("./calendar/holidays");
Object.defineProperty(exports, "addHoliday", { enumerable: true, get: function () { return holidays_1.addHoliday; } });
Object.defineProperty(exports, "addHolidaySet", { enumerable: true, get: function () { return holidays_1.addHolidaySet; } });
Object.defineProperty(exports, "getHolidays", { enumerable: true, get: function () { return holidays_1.getHolidays; } });
Object.defineProperty(exports, "isHoliday", { enumerable: true, get: function () { return holidays_1.isHoliday; } });
Object.defineProperty(exports, "getBusinessDaysInPeriod", { enumerable: true, get: function () { return holidays_1.getBusinessDaysInPeriod; } });
var dateRanges_1 = require("./calendar/dateRanges");
Object.defineProperty(exports, "getFiscalYearToDate", { enumerable: true, get: function () { return dateRanges_1.getFiscalYearToDate; } });
Object.defineProperty(exports, "getFiscalQuarterToDate", { enumerable: true, get: function () { return dateRanges_1.getFiscalQuarterToDate; } });
Object.defineProperty(exports, "getFiscalMonthToDate", { enumerable: true, get: function () { return dateRanges_1.getFiscalMonthToDate; } });
Object.defineProperty(exports, "getDateRangeInfo", { enumerable: true, get: function () { return dateRanges_1.getDateRangeInfo; } });
var comparisons_1 = require("./calendar/comparisons");
Object.defineProperty(exports, "getSamePeriodLastYear", { enumerable: true, get: function () { return comparisons_1.getSamePeriodLastYear; } });
Object.defineProperty(exports, "compareFiscalPeriods", { enumerable: true, get: function () { return comparisons_1.compareFiscalPeriods; } });
Object.defineProperty(exports, "getYearOverYearChange", { enumerable: true, get: function () { return comparisons_1.getYearOverYearChange; } });
var presets_1 = require("./calendar/presets");
Object.defineProperty(exports, "getFiscalYearWithPreset", { enumerable: true, get: function () { return presets_1.getFiscalYearWithPreset; } });
