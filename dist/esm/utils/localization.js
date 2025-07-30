/**
 * Localization utilities for fiscal-year-calendar
 * Provides functions to format dates and calendar data in different languages
 */
import { format } from 'date-fns';
import { enUS, enGB, fr, de, es, it, ja, ko, zhCN, ru } from 'date-fns/locale';
import { toDateObject } from './dateUtils';
// Available locales
export const AVAILABLE_LOCALES = {
    'en-US': enUS,
    'en-GB': enGB,
    'fr': fr,
    'de': de,
    'es': es,
    'it': it,
    'ja': ja,
    'ko': ko,
    'zh-CN': zhCN,
    'ru': ru
};
// Current locale
let currentLocale = enUS;
let currentLocaleCode = 'en-US';
/**
 * Set the current locale
 * @param localeCode - The locale code to set
 * @returns True if the locale was set successfully, false otherwise
 */
export function setLocale(localeCode) {
    if (Object.prototype.hasOwnProperty.call(AVAILABLE_LOCALES, localeCode)) {
        currentLocale = AVAILABLE_LOCALES[localeCode];
        currentLocaleCode = localeCode;
        return true;
    }
    return false;
}
/**
 * Get the current locale
 * @returns The current locale code
 */
export function getLocale() {
    return currentLocaleCode;
}
/**
 * Get available locales
 * @returns Array of available locale codes
 */
export function getAvailableLocales() {
    return Object.keys(AVAILABLE_LOCALES);
}
/**
 * Format a date using the current locale
 * @param date - The date to format
 * @param formatStr - The format string
 * @returns The formatted date string
 */
export function formatLocalizedDate(date, formatStr = 'PPP') {
    const dateObj = toDateObject(date);
    return format(dateObj, formatStr, { locale: currentLocale });
}
/**
 * Get the localized month name
 * @param month - The month number (0-11)
 * @param formatType - The format ('long' or 'short')
 * @returns The localized month name
 */
export function getLocalizedMonthName(month, formatType = 'long') {
    const date = new Date(2000, month, 1);
    return formatType === 'long'
        ? format(date, 'MMMM', { locale: currentLocale })
        : format(date, 'MMM', { locale: currentLocale });
}
/**
 * Get the localized day name
 * @param day - The day of week (0-6, where 0 is Sunday)
 * @param formatType - The format ('long' or 'short')
 * @returns The localized day name
 */
export function getLocalizedDayName(day, formatType = 'long') {
    // Create a date for the specified day of week
    const date = new Date(2000, 0, 2 + day); // Jan 2, 2000 was a Sunday
    return formatType === 'long'
        ? format(date, 'EEEE', { locale: currentLocale })
        : format(date, 'E', { locale: currentLocale });
}
/**
 * Get the localized quarter name
 * @param quarter - The quarter number (1-4)
 * @returns The localized quarter name
 */
export function getLocalizedQuarterName(quarter) {
    var _a;
    const quarterNames = {
        'en-US': [`Q1`, `Q2`, `Q3`, `Q4`],
        'en-GB': [`Q1`, `Q2`, `Q3`, `Q4`],
        'fr': [`T1`, `T2`, `T3`, `T4`],
        'de': [`Q1`, `Q2`, `Q3`, `Q4`],
        'es': [`T1`, `T2`, `T3`, `T4`],
        'it': [`T1`, `T2`, `T3`, `T4`],
        'ja': [`第1四半期`, `第2四半期`, `第3四半期`, `第4四半期`],
        'ko': [`1분기`, `2분기`, `3분기`, `4분기`],
        'zh-CN': [`第一季度`, `第二季度`, `第三季度`, `第四季度`],
        'ru': [`К1`, `К2`, `К3`, `К4`]
    };
    const index = Math.max(0, Math.min(3, quarter - 1));
    return ((_a = quarterNames[currentLocaleCode]) === null || _a === void 0 ? void 0 : _a[index]) || `Q${quarter}`;
}
/**
 * Format a date range using the current locale
 * @param startDate - The start date
 * @param endDate - The end date
 * @param formatStr - The format string
 * @returns The formatted date range string
 */
export function formatLocalizedDateRange(startDate, endDate, formatStr = 'PPP') {
    const start = toDateObject(startDate);
    const end = toDateObject(endDate);
    const startFormatted = format(start, formatStr, { locale: currentLocale });
    const endFormatted = format(end, formatStr, { locale: currentLocale });
    return `${startFormatted} - ${endFormatted}`;
}
/**
 * Localize month options
 * @param months - The month options to localize
 * @returns The localized month options
 */
export function localizeMonthOptions(months) {
    return months.map(month => {
        const startDate = toDateObject(month.startTime);
        const endDate = toDateObject(month.endTime);
        return {
            ...month,
            name: format(startDate, 'MMMM', { locale: currentLocale }),
            startTime: startDate.toString(),
            endTime: endDate.toString()
        };
    });
}
/**
 * Localize week options
 * @param weeks - The week options to localize
 * @returns The localized week options
 */
export function localizeWeekOptions(weeks) {
    return weeks.map(week => {
        const startDate = toDateObject(week.startTime);
        const endDate = toDateObject(week.endTime);
        return {
            ...week,
            startTime: startDate.toString(),
            endTime: endDate.toString()
        };
    });
}
/**
 * Localize quarter options
 * @param quarters - The quarter options to localize
 * @returns The localized quarter options
 */
export function localizeQuarterOptions(quarters) {
    return quarters.map(quarter => {
        const startDate = toDateObject(quarter.startTime);
        const endDate = toDateObject(quarter.endTime);
        return {
            ...quarter,
            quarter: getLocalizedQuarterName(parseInt(quarter.quarter)),
            startTime: startDate.toString(),
            endTime: endDate.toString()
        };
    });
}
