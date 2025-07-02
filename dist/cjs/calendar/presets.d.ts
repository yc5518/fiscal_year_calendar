/**
 * Fiscal year presets functionality
 */
import moment from "moment";
import { FiscalYearPreset } from "../types";
import { getWeekOptions, getQuarterOptions, getMonthOptions } from "./fiscalYear";
/**
 * Gets fiscal year information using a preset
 * @param {string} presetKey - The preset key
 * @param {string} timezone - The timezone
 * @param {number} year - The fiscal year
 * @param {string} startOfWeek - The start of week setting
 * @returns {Object} The fiscal year information
 */
declare function getFiscalYearWithPreset(presetKey: string, timezone?: string | null, year?: number | null, startOfWeek?: string): {
    preset: FiscalYearPreset;
    fiscalYear: number;
    startDate: moment.Moment;
    endDate: moment.Moment;
    weeks: ReturnType<typeof getWeekOptions>;
    quarters: ReturnType<typeof getQuarterOptions>;
    months: ReturnType<typeof getMonthOptions>;
};
export { getFiscalYearWithPreset };
