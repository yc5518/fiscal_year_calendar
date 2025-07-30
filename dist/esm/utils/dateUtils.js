/**
 * Date utilities using date-fns instead of Moment.js
 * This file provides a consistent API for date operations while using date-fns under the hood
 */
import { format, parse, parseISO, isValid, addDays, addMonths, addYears, subDays, subMonths, subYears, differenceInDays, differenceInMonths, differenceInYears, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, getDay, getDate, getMonth, getYear, isBefore, isAfter, isEqual } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime, format as formatTz } from 'date-fns-tz';
import { DEFAULT_DATE_FORMAT } from './constants';
/**
 * Convert any date input to a Date object
 * @param date - The date input to convert
 * @param timezone - Optional timezone
 * @returns A Date object
 */
export function toDateObject(date, timezone) {
    if (date instanceof Date) {
        return timezone ? utcToZonedTime(date, timezone) : date;
    }
    if (typeof date === 'string') {
        // Try to parse as ISO string first
        const parsedDate = parseISO(date);
        if (isValid(parsedDate)) {
            return timezone ? utcToZonedTime(parsedDate, timezone) : parsedDate;
        }
        // If not valid, try to parse with default format
        return parse(date, DEFAULT_DATE_FORMAT, new Date());
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
export function createDate(date, timezone) {
    if (!date) {
        const now = new Date();
        return timezone ? utcToZonedTime(now, timezone) : now;
    }
    return toDateObject(date, timezone);
}
/**
 * Clone a date object
 * @param date - The date to clone
 * @returns A new Date object
 */
export function cloneDate(date) {
    return new Date(date.getTime());
}
/**
 * Format a date
 * @param date - The date to format
 * @param formatStr - The format string
 * @param timezone - Optional timezone
 * @returns Formatted date string
 */
export function formatDate(date, formatStr = DEFAULT_DATE_FORMAT, timezone) {
    const dateObj = toDateObject(date, timezone);
    return timezone ? formatTz(dateObj, formatStr, { timeZone: timezone }) : format(dateObj, formatStr);
}
/**
 * Add time to a date
 * @param date - The base date
 * @param amount - The amount to add
 * @param unit - The unit (days, months, years)
 * @returns A new Date with the added time
 */
export function addTime(date, amount, unit) {
    const dateObj = toDateObject(date);
    switch (unit) {
        case 'days':
            return addDays(dateObj, amount);
        case 'months':
            return addMonths(dateObj, amount);
        case 'years':
            return addYears(dateObj, amount);
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
export function subtractTime(date, amount, unit) {
    const dateObj = toDateObject(date);
    switch (unit) {
        case 'days':
            return subDays(dateObj, amount);
        case 'months':
            return subMonths(dateObj, amount);
        case 'years':
            return subYears(dateObj, amount);
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
export function getDateDifference(date1, date2, unit) {
    const dateObj1 = toDateObject(date1);
    const dateObj2 = toDateObject(date2);
    switch (unit) {
        case 'days':
            return differenceInDays(dateObj1, dateObj2);
        case 'months':
            return differenceInMonths(dateObj1, dateObj2);
        case 'years':
            return differenceInYears(dateObj1, dateObj2);
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
export function getStartOfPeriod(date, unit, weekStartsOn = 1) {
    const dateObj = toDateObject(date);
    switch (unit) {
        case 'week':
            return startOfWeek(dateObj, { weekStartsOn });
        case 'month':
            return startOfMonth(dateObj);
        case 'year':
            return startOfYear(dateObj);
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
export function getEndOfPeriod(date, unit, weekStartsOn = 1) {
    const dateObj = toDateObject(date);
    switch (unit) {
        case 'week':
            return endOfWeek(dateObj, { weekStartsOn });
        case 'month':
            return endOfMonth(dateObj);
        case 'year':
            return endOfYear(dateObj);
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
export function compareDates(date1, date2) {
    const dateObj1 = toDateObject(date1);
    const dateObj2 = toDateObject(date2);
    if (isBefore(dateObj1, dateObj2))
        return -1;
    if (isAfter(dateObj1, dateObj2))
        return 1;
    return 0;
}
/**
 * Check if two dates are equal
 * @param date1 - The first date
 * @param date2 - The second date
 * @returns True if the dates are equal
 */
export function areDatesEqual(date1, date2) {
    const dateObj1 = toDateObject(date1);
    const dateObj2 = toDateObject(date2);
    return isEqual(dateObj1, dateObj2);
}
/**
 * Get a date property
 * @param date - The date
 * @param prop - The property to get (day, date, month, year)
 * @returns The property value
 */
export function getDateProperty(date, prop) {
    const dateObj = toDateObject(date);
    switch (prop) {
        case 'day':
            return getDay(dateObj);
        case 'date':
            return getDate(dateObj);
        case 'month':
            return getMonth(dateObj);
        case 'year':
            return getYear(dateObj);
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
export function convertToTimezone(date, timezone) {
    const dateObj = toDateObject(date);
    return utcToZonedTime(dateObj, timezone);
}
/**
 * Convert a date from a timezone to UTC
 * @param date - The date
 * @param timezone - The timezone
 * @returns A new Date in UTC
 */
export function convertFromTimezone(date, timezone) {
    const dateObj = toDateObject(date);
    return zonedTimeToUtc(dateObj, timezone);
}
