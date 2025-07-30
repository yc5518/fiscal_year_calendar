"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVAILABLE_LOCALES = void 0;
exports.setLocale = setLocale;
exports.getLocale = getLocale;
exports.getAvailableLocales = getAvailableLocales;
exports.formatLocalizedDate = formatLocalizedDate;
exports.getLocalizedMonthName = getLocalizedMonthName;
exports.getLocalizedDayName = getLocalizedDayName;
exports.getLocalizedQuarterName = getLocalizedQuarterName;
exports.formatLocalizedDateRange = formatLocalizedDateRange;
exports.localizeMonthOptions = localizeMonthOptions;
exports.localizeWeekOptions = localizeWeekOptions;
exports.localizeQuarterOptions = localizeQuarterOptions;
/**
 * Localization utilities for fiscal-year-calendar
 * Provides functions to format dates and calendar data in different languages
 */
const date_fns_1 = require("date-fns");
const locale_1 = require("date-fns/locale");
const dateUtils_1 = require("./dateUtils");
// Available locales
exports.AVAILABLE_LOCALES = {
    'en-US': locale_1.enUS,
    'en-GB': locale_1.enGB,
    'fr': locale_1.fr,
    'de': locale_1.de,
    'es': locale_1.es,
    'it': locale_1.it,
    'ja': locale_1.ja,
    'ko': locale_1.ko,
    'zh-CN': locale_1.zhCN,
    'ru': locale_1.ru
};
// Current locale
let currentLocale = locale_1.enUS;
let currentLocaleCode = 'en-US';
/**
 * Set the current locale
 * @param localeCode - The locale code to set
 * @returns True if the locale was set successfully, false otherwise
 */
function setLocale(localeCode) {
    if (Object.prototype.hasOwnProperty.call(exports.AVAILABLE_LOCALES, localeCode)) {
        currentLocale = exports.AVAILABLE_LOCALES[localeCode];
        currentLocaleCode = localeCode;
        return true;
    }
    return false;
}
/**
 * Get the current locale
 * @returns The current locale code
 */
function getLocale() {
    return currentLocaleCode;
}
/**
 * Get available locales
 * @returns Array of available locale codes
 */
function getAvailableLocales() {
    return Object.keys(exports.AVAILABLE_LOCALES);
}
/**
 * Format a date using the current locale
 * @param date - The date to format
 * @param formatStr - The format string
 * @returns The formatted date string
 */
function formatLocalizedDate(date, formatStr = 'PPP') {
    const dateObj = (0, dateUtils_1.toDateObject)(date);
    return (0, date_fns_1.format)(dateObj, formatStr, { locale: currentLocale });
}
/**
 * Get the localized month name
 * @param month - The month number (0-11)
 * @param formatType - The format ('long' or 'short')
 * @returns The localized month name
 */
function getLocalizedMonthName(month, formatType = 'long') {
    const date = new Date(2000, month, 1);
    return formatType === 'long'
        ? (0, date_fns_1.format)(date, 'MMMM', { locale: currentLocale })
        : (0, date_fns_1.format)(date, 'MMM', { locale: currentLocale });
}
/**
 * Get the localized day name
 * @param day - The day of week (0-6, where 0 is Sunday)
 * @param formatType - The format ('long' or 'short')
 * @returns The localized day name
 */
function getLocalizedDayName(day, formatType = 'long') {
    // Create a date for the specified day of week
    const date = new Date(2000, 0, 2 + day); // Jan 2, 2000 was a Sunday
    return formatType === 'long'
        ? (0, date_fns_1.format)(date, 'EEEE', { locale: currentLocale })
        : (0, date_fns_1.format)(date, 'E', { locale: currentLocale });
}
/**
 * Get the localized quarter name
 * @param quarter - The quarter number (1-4)
 * @returns The localized quarter name
 */
function getLocalizedQuarterName(quarter) {
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
function formatLocalizedDateRange(startDate, endDate, formatStr = 'PPP') {
    const start = (0, dateUtils_1.toDateObject)(startDate);
    const end = (0, dateUtils_1.toDateObject)(endDate);
    const startFormatted = (0, date_fns_1.format)(start, formatStr, { locale: currentLocale });
    const endFormatted = (0, date_fns_1.format)(end, formatStr, { locale: currentLocale });
    return `${startFormatted} - ${endFormatted}`;
}
/**
 * Localize month options
 * @param months - The month options to localize
 * @returns The localized month options
 */
function localizeMonthOptions(months) {
    return months.map(month => {
        const startDate = (0, dateUtils_1.toDateObject)(month.startTime);
        const endDate = (0, dateUtils_1.toDateObject)(month.endTime);
        return {
            ...month,
            name: (0, date_fns_1.format)(startDate, 'MMMM', { locale: currentLocale }),
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
function localizeWeekOptions(weeks) {
    return weeks.map(week => {
        const startDate = (0, dateUtils_1.toDateObject)(week.startTime);
        const endDate = (0, dateUtils_1.toDateObject)(week.endTime);
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
function localizeQuarterOptions(quarters) {
    return quarters.map(quarter => {
        const startDate = (0, dateUtils_1.toDateObject)(quarter.startTime);
        const endDate = (0, dateUtils_1.toDateObject)(quarter.endTime);
        return {
            ...quarter,
            quarter: getLocalizedQuarterName(parseInt(quarter.quarter)),
            startTime: startDate.toString(),
            endTime: endDate.toString()
        };
    });
}
