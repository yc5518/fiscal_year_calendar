/**
 * Type for date inputs - can be Date object, ISO string, or timestamp
 */
export type DateInput = Date | string | number;
/**
 * Convert any date input to a Date object
 * @param date - The date input to convert
 * @param timezone - Optional timezone
 * @returns A Date object
 */
export declare function toDateObject(date: DateInput, timezone?: string): Date;
/**
 * Create a date object
 * @param date - Optional date input
 * @param timezone - Optional timezone
 * @returns A Date object
 */
export declare function createDate(date?: DateInput, timezone?: string): Date;
/**
 * Clone a date object
 * @param date - The date to clone
 * @returns A new Date object
 */
export declare function cloneDate(date: Date): Date;
/**
 * Format a date
 * @param date - The date to format
 * @param formatStr - The format string
 * @param timezone - Optional timezone
 * @returns Formatted date string
 */
export declare function formatDate(date: DateInput, formatStr?: string, timezone?: string): string;
/**
 * Add time to a date
 * @param date - The base date
 * @param amount - The amount to add
 * @param unit - The unit (days, months, years)
 * @returns A new Date with the added time
 */
export declare function addTime(date: DateInput, amount: number, unit: 'days' | 'months' | 'years'): Date;
/**
 * Subtract time from a date
 * @param date - The base date
 * @param amount - The amount to subtract
 * @param unit - The unit (days, months, years)
 * @returns A new Date with the subtracted time
 */
export declare function subtractTime(date: DateInput, amount: number, unit: 'days' | 'months' | 'years'): Date;
/**
 * Get the difference between two dates
 * @param date1 - The first date
 * @param date2 - The second date
 * @param unit - The unit (days, months, years)
 * @returns The difference in the specified unit
 */
export declare function getDateDifference(date1: DateInput, date2: DateInput, unit: 'days' | 'months' | 'years'): number;
/**
 * Get the start of a period
 * @param date - The date
 * @param unit - The unit (week, month, year)
 * @param weekStartsOn - The day the week starts on (0 = Sunday, 1 = Monday, etc.)
 * @returns A new Date at the start of the period
 */
export declare function getStartOfPeriod(date: DateInput, unit: 'week' | 'month' | 'year', weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6): Date;
/**
 * Get the end of a period
 * @param date - The date
 * @param unit - The unit (week, month, year)
 * @param weekStartsOn - The day the week starts on (0 = Sunday, 1 = Monday, etc.)
 * @returns A new Date at the end of the period
 */
export declare function getEndOfPeriod(date: DateInput, unit: 'week' | 'month' | 'year', weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6): Date;
/**
 * Compare two dates
 * @param date1 - The first date
 * @param date2 - The second date
 * @returns -1 if date1 is before date2, 0 if equal, 1 if after
 */
export declare function compareDates(date1: DateInput, date2: DateInput): -1 | 0 | 1;
/**
 * Check if two dates are equal
 * @param date1 - The first date
 * @param date2 - The second date
 * @returns True if the dates are equal
 */
export declare function areDatesEqual(date1: DateInput, date2: DateInput): boolean;
/**
 * Get a date property
 * @param date - The date
 * @param prop - The property to get (day, date, month, year)
 * @returns The property value
 */
export declare function getDateProperty(date: DateInput, prop: 'day' | 'date' | 'month' | 'year'): number;
/**
 * Convert a date to a timezone
 * @param date - The date
 * @param timezone - The timezone
 * @returns A new Date in the specified timezone
 */
export declare function convertToTimezone(date: DateInput, timezone: string): Date;
/**
 * Convert a date from a timezone to UTC
 * @param date - The date
 * @param timezone - The timezone
 * @returns A new Date in UTC
 */
export declare function convertFromTimezone(date: DateInput, timezone: string): Date;
