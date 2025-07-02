/**
 * Fiscal year presets functionality
 */
import moment from "moment";
import { START_OF_WEEK, FISCAL_YEAR_PRESETS } from "../utils/constants";
import { getFiscalYear, getStartDate, getEndDate, getWeekOptions, getQuarterOptions, getMonthOptions } from "./fiscalYear";
/**
 * Gets fiscal year information using a preset
 * @param {string} presetKey - The preset key
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @returns {Object} The fiscal year information
 */
function getFiscalYearWithPreset(presetKey, timezone = null, year = null, startOfWeek = START_OF_WEEK.monday.value) {
    // Get the preset configuration
    const preset = FISCAL_YEAR_PRESETS[presetKey] || FISCAL_YEAR_PRESETS["calendar-year"];
    // If no year is provided, use the current date to determine the fiscal year
    const currentDate = timezone ? moment.tz(timezone) : moment();
    const fiscalYear = year || getFiscalYear(currentDate, timezone, preset.fyStartMonth, preset.fyStartDay);
    // Get the start and end dates of the fiscal year
    const startDate = getStartDate(timezone, fiscalYear, startOfWeek, preset.fyStartMonth, preset.fyStartDay);
    const endDate = getEndDate(timezone, fiscalYear, startOfWeek, preset.fyStartMonth, preset.fyStartDay);
    // Get the week, quarter, and month options for the fiscal year
    const weeks = getWeekOptions(startOfWeek, timezone, fiscalYear, preset.fyStartMonth, preset.fyStartDay);
    const quarters = getQuarterOptions(startOfWeek, timezone, fiscalYear, preset.fyStartMonth, preset.fyStartDay);
    const months = getMonthOptions(startOfWeek, timezone, fiscalYear, preset.fyStartMonth, preset.fyStartDay);
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
export { getFiscalYearWithPreset };
