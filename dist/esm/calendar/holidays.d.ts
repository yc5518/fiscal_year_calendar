/**
 * Holiday handling functionality
 */
import moment from "moment";
import { Holiday, CountryCode } from "../types";
/**
 * Adds a holiday to the holiday registry
 * @param {string|Date} date - The date of the holiday
 * @param {string} name - The name of the holiday
 * @param {boolean} recurring - Whether the holiday recurs annually
 * @returns {Holiday} The added holiday
 */
declare function addHoliday(date: string | Date, name: string, recurring?: boolean): Holiday;
/**
 * Adds a set of common holidays for a specific country
 * @param {CountryCode} countryCode - The country code
 * @returns {Holiday[]} The added holidays
 */
declare function addHolidaySet(countryCode: CountryCode): Holiday[];
/**
 * Gets all registered holidays
 * @returns {Holiday[]} The registered holidays
 */
declare function getHolidays(): Holiday[];
/**
 * Checks if a date is a holiday
 * @param {string|Date|moment.Moment} date - The date to check
 * @returns {boolean} Whether the date is a holiday
 */
declare function isHoliday(date: string | Date | moment.Moment): boolean;
/**
 * Gets the number of business days in a period, optionally excluding holidays
 * @param {string|Date|moment.Moment} startDate - The start date
 * @param {string|Date|moment.Moment} endDate - The end date
 * @param {boolean} excludeHolidays - Whether to exclude holidays
 * @returns {number} The number of business days
 */
declare function getBusinessDaysInPeriod(startDate: string | Date | moment.Moment, endDate: string | Date | moment.Moment, excludeHolidays?: boolean): number;
export { addHoliday, addHolidaySet, getHolidays, isHoliday, getBusinessDaysInPeriod };
