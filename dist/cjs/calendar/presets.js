"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiscalYearWithPreset = getFiscalYearWithPreset;
/**
 * Fiscal year presets functionality
 */
const moment_1 = __importDefault(require("moment"));
const constants_1 = require("../utils/constants");
const fiscalYear_1 = require("./fiscalYear");
/**
 * Gets fiscal year information using a preset
 * @param {string} presetKey - The preset key
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @returns {Object} The fiscal year information
 */
function getFiscalYearWithPreset(presetKey, timezone = null, year = null, startOfWeek = constants_1.START_OF_WEEK.monday.value) {
    // Get the preset configuration
    const preset = constants_1.FISCAL_YEAR_PRESETS[presetKey] || constants_1.FISCAL_YEAR_PRESETS["calendar-year"];
    // If no year is provided, use the current date to determine the fiscal year
    const currentDate = timezone ? moment_1.default.tz(timezone) : (0, moment_1.default)();
    const fiscalYear = year || (0, fiscalYear_1.getFiscalYear)(currentDate, timezone, preset.fyStartMonth, preset.fyStartDay);
    // Get the start and end dates of the fiscal year
    const startDate = (0, fiscalYear_1.getStartDate)(timezone, fiscalYear, startOfWeek, preset.fyStartMonth, preset.fyStartDay);
    const endDate = (0, fiscalYear_1.getEndDate)(timezone, fiscalYear, startOfWeek, preset.fyStartMonth, preset.fyStartDay);
    // Get the week, quarter, and month options for the fiscal year
    const weeks = (0, fiscalYear_1.getWeekOptions)(startOfWeek, timezone, fiscalYear, preset.fyStartMonth, preset.fyStartDay);
    const quarters = (0, fiscalYear_1.getQuarterOptions)(startOfWeek, timezone, fiscalYear, preset.fyStartMonth, preset.fyStartDay);
    const months = (0, fiscalYear_1.getMonthOptions)(startOfWeek, timezone, fiscalYear, preset.fyStartMonth, preset.fyStartDay);
    return {
        preset,
        fiscalYear,
        startDate,
        endDate,
        weeks,
        quarters,
        months
    };
}
