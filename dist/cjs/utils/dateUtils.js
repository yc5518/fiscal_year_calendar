"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDateObject = toDateObject;
exports.createDate = createDate;
exports.cloneDate = cloneDate;
exports.formatDate = formatDate;
exports.addTime = addTime;
exports.subtractTime = subtractTime;
exports.getDateDifference = getDateDifference;
exports.getStartOfPeriod = getStartOfPeriod;
exports.getEndOfPeriod = getEndOfPeriod;
exports.compareDates = compareDates;
exports.areDatesEqual = areDatesEqual;
exports.getDateProperty = getDateProperty;
exports.convertToTimezone = convertToTimezone;
exports.convertFromTimezone = convertFromTimezone;
/**
 * Date utilities using date-fns instead of Moment.js
 * This file provides a consistent API for date operations while using date-fns under the hood
 */
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
const constants_1 = require("./constants");
/**
 * Convert any date input to a Date object
 * @param date - The date input to convert
 * @param timezone - Optional timezone
 * @returns A Date object
 */
function toDateObject(date, timezone) {
    if (date instanceof Date) {
        return timezone ? (0, date_fns_tz_1.utcToZonedTime)(date, timezone) : date;
    }
    if (typeof date === 'string') {
        // Try to parse as ISO string first
        const parsedDate = (0, date_fns_1.parseISO)(date);
        if ((0, date_fns_1.isValid)(parsedDate)) {
            return timezone ? (0, date_fns_tz_1.utcToZonedTime)(parsedDate, timezone) : parsedDate;
        }
        // If not valid, try to parse with default format
        return (0, date_fns_1.parse)(date, constants_1.DEFAULT_DATE_FORMAT, new Date());
    }
    // Handle timestamp
    return new Date(date);
}
/**
 * Create a date object
 * @param date - Optional date input
 * @param timezone - Optional timezone
 * @returns A Date object
 */
function createDate(date, timezone) {
    if (!date) {
        const now = new Date();
        return timezone ? (0, date_fns_tz_1.utcToZonedTime)(now, timezone) : now;
    }
    return toDateObject(date, timezone);
}
/**
 * Clone a date object
 * @param date - The date to clone
 * @returns A new Date object
 */
function cloneDate(date) {
    return new Date(date.getTime());
}
/**
 * Format a date
 * @param date - The date to format
 * @param formatStr - The format string
 * @param timezone - Optional timezone
 * @returns Formatted date string
 */
function formatDate(date, formatStr = constants_1.DEFAULT_DATE_FORMAT, timezone) {
    const dateObj = toDateObject(date, timezone);
    return timezone ? (0, date_fns_tz_1.format)(dateObj, formatStr, { timeZone: timezone }) : (0, date_fns_1.format)(dateObj, formatStr);
}
/**
 * Add time to a date
 * @param date - The base date
 * @param amount - The amount to add
 * @param unit - The unit (days, months, years)
 * @returns A new Date with the added time
 */
function addTime(date, amount, unit) {
    const dateObj = toDateObject(date);
    switch (unit) {
        case 'days':
            return (0, date_fns_1.addDays)(dateObj, amount);
        case 'months':
            return (0, date_fns_1.addMonths)(dateObj, amount);
        case 'years':
            return (0, date_fns_1.addYears)(dateObj, amount);
        default:
            return dateObj;
    }
}
/**
 * Subtract time from a date
 * @param date - The base date
 * @param amount - The amount to subtract
 * @param unit - The unit (days, months, years)
 * @returns A new Date with the subtracted time
 */
function subtractTime(date, amount, unit) {
    const dateObj = toDateObject(date);
    switch (unit) {
        case 'days':
            return (0, date_fns_1.subDays)(dateObj, amount);
        case 'months':
            return (0, date_fns_1.subMonths)(dateObj, amount);
        case 'years':
            return (0, date_fns_1.subYears)(dateObj, amount);
        default:
            return dateObj;
    }
}
/**
 * Get the difference between two dates
 * @param date1 - The first date
 * @param date2 - The second date
 * @param unit - The unit (days, months, years)
 * @returns The difference in the specified unit
 */
function getDateDifference(date1, date2, unit) {
    const dateObj1 = toDateObject(date1);
    const dateObj2 = toDateObject(date2);
    switch (unit) {
        case 'days':
            return (0, date_fns_1.differenceInDays)(dateObj1, dateObj2);
        case 'months':
            return (0, date_fns_1.differenceInMonths)(dateObj1, dateObj2);
        case 'years':
            return (0, date_fns_1.differenceInYears)(dateObj1, dateObj2);
        default:
            return 0;
    }
}
/**
 * Get the start of a period
 * @param date - The date
 * @param unit - The unit (week, month, year)
 * @param weekStartsOn - The day the week starts on (0 = Sunday, 1 = Monday, etc.)
 * @returns A new Date at the start of the period
 */
function getStartOfPeriod(date, unit, weekStartsOn = 1) {
    const dateObj = toDateObject(date);
    switch (unit) {
        case 'week':
            return (0, date_fns_1.startOfWeek)(dateObj, { weekStartsOn });
        case 'month':
            return (0, date_fns_1.startOfMonth)(dateObj);
        case 'year':
            return (0, date_fns_1.startOfYear)(dateObj);
        default:
            return dateObj;
    }
}
/**
 * Get the end of a period
 * @param date - The date
 * @param unit - The unit (week, month, year)
 * @param weekStartsOn - The day the week starts on (0 = Sunday, 1 = Monday, etc.)
 * @returns A new Date at the end of the period
 */
function getEndOfPeriod(date, unit, weekStartsOn = 1) {
    const dateObj = toDateObject(date);
    switch (unit) {
        case 'week':
            return (0, date_fns_1.endOfWeek)(dateObj, { weekStartsOn });
        case 'month':
            return (0, date_fns_1.endOfMonth)(dateObj);
        case 'year':
            return (0, date_fns_1.endOfYear)(dateObj);
        default:
            return dateObj;
    }
}
/**
 * Compare two dates
 * @param date1 - The first date
 * @param date2 - The second date
 * @returns -1 if date1 is before date2, 0 if equal, 1 if after
 */
function compareDates(date1, date2) {
    const dateObj1 = toDateObject(date1);
    const dateObj2 = toDateObject(date2);
    if ((0, date_fns_1.isBefore)(dateObj1, dateObj2))
        return -1;
    if ((0, date_fns_1.isAfter)(dateObj1, dateObj2))
        return 1;
    return 0;
}
/**
 * Check if two dates are equal
 * @param date1 - The first date
 * @param date2 - The second date
 * @returns True if the dates are equal
 */
function areDatesEqual(date1, date2) {
    const dateObj1 = toDateObject(date1);
    const dateObj2 = toDateObject(date2);
    return (0, date_fns_1.isEqual)(dateObj1, dateObj2);
}
/**
 * Get a date property
 * @param date - The date
 * @param prop - The property to get (day, date, month, year)
 * @returns The property value
 */
function getDateProperty(date, prop) {
    const dateObj = toDateObject(date);
    switch (prop) {
        case 'day':
            return (0, date_fns_1.getDay)(dateObj);
        case 'date':
            return (0, date_fns_1.getDate)(dateObj);
        case 'month':
            return (0, date_fns_1.getMonth)(dateObj);
        case 'year':
            return (0, date_fns_1.getYear)(dateObj);
        default:
            return 0;
    }
}
/**
 * Convert a date to a timezone
 * @param date - The date
 * @param timezone - The timezone
 * @returns A new Date in the specified timezone
 */
function convertToTimezone(date, timezone) {
    const dateObj = toDateObject(date);
    return (0, date_fns_tz_1.utcToZonedTime)(dateObj, timezone);
}
/**
 * Convert a date from a timezone to UTC
 * @param date - The date
 * @param timezone - The timezone
 * @returns A new Date in UTC
 */
function convertFromTimezone(date, timezone) {
    const dateObj = toDateObject(date);
    return (0, date_fns_tz_1.zonedTimeToUtc)(dateObj, timezone);
}
