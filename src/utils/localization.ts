/**
 * Localization functionality for fiscal-year-calendar
 */
import moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/es';
import 'moment/locale/de';
import 'moment/locale/it';
import 'moment/locale/ja';
import 'moment/locale/zh-cn';
import 'moment/locale/pt';
import 'moment/locale/ru';
import 'moment/locale/ar';
import 'moment/locale/hi';
import 'moment/locale/ko';
import { MonthOption, QuarterOption, WeekOption } from '../types';

/**
 * Available locales for the fiscal-year-calendar
 */
export const AVAILABLE_LOCALES = [
    'en', // English (default)
    'fr', // French
    'es', // Spanish
    'de', // German
    'it', // Italian
    'ja', // Japanese
    'zh-cn', // Chinese (Simplified)
    'pt', // Portuguese
    'ru', // Russian
    'ar', // Arabic
    'hi', // Hindi
    'ko', // Korean
];

/**
 * Month name translations for different locales
 */
export const MONTH_TRANSLATIONS: Record<string, string[]> = {
    // These are just examples, moment.js will handle the actual translations
    'en': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    'fr': ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    'es': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    'de': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
};

/**
 * Day name translations for different locales
 */
export const DAY_TRANSLATIONS: Record<string, string[]> = {
    // These are just examples, moment.js will handle the actual translations
    'en': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    'fr': ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    'es': ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    'de': ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
};

/**
 * Sets the locale for date formatting
 * @param locale - The locale to set (e.g., 'en', 'fr', 'es', etc.)
 * @returns The current locale after setting
 */
export function setLocale(locale: string): string {
    if (AVAILABLE_LOCALES.includes(locale)) {
        moment.locale(locale);
        return moment.locale();
    } else {
        console.warn(`Locale '${locale}' not available. Using default locale.`);
        moment.locale('en');
        return moment.locale();
    }
}

/**
 * Gets the current locale
 * @returns The current locale
 */
export function getLocale(): string {
    return moment.locale();
}

/**
 * Gets all available locales
 * @returns Array of available locale codes
 */
export function getAvailableLocales(): string[] {
    return AVAILABLE_LOCALES;
}

/**
 * Formats a date according to the current locale
 * @param date - The date to format
 * @param format - The format string (optional, uses locale-specific default if not provided)
 * @returns The formatted date string
 */
export function formatLocalizedDate(date: string | Date | moment.Moment, format?: string): string {
    const momentDate = moment(date);
    return format ? momentDate.format(format) : momentDate.format('L');
}

/**
 * Gets the localized month name
 * @param month - Month number (0-11)
 * @param locale - Locale (optional, uses current locale if not provided)
 * @returns The localized month name
 */
export function getLocalizedMonthName(month: number, locale?: string): string {
    if (locale) {
        moment.locale(locale);
    }
    return moment().month(month).format('MMMM');
}

/**
 * Gets the localized day name
 * @param day - Day number (0-6, where 0 is Sunday)
 * @param locale - Locale (optional, uses current locale if not provided)
 * @returns The localized day name
 */
export function getLocalizedDayName(day: number, locale?: string): string {
    if (locale) {
        moment.locale(locale);
    }
    return moment().day(day).format('dddd');
}

/**
 * Localizes month options by translating month names
 * @param monthOptions - Array of month options
 * @param locale - Locale to use (optional, uses current locale if not provided)
 * @returns Array of localized month options
 */
export function localizeMonthOptions(monthOptions: MonthOption[], locale?: string): MonthOption[] {
    if (locale) {
        moment.locale(locale);
    }
    
    return monthOptions.map(month => {
        const monthIndex = parseInt(month.month) - 1;
        const calendarMonthIndex = new Date(month.startTime).getMonth();
        
        return {
            ...month,
            name: getLocalizedMonthName(calendarMonthIndex, locale)
        };
    });
}

/**
 * Formats a date range according to the current locale
 * @param startDate - The start date
 * @param endDate - The end date
 * @param format - The format string (optional)
 * @returns The formatted date range string
 */
export function formatLocalizedDateRange(
    startDate: string | Date | moment.Moment,
    endDate: string | Date | moment.Moment,
    format?: string
): string {
    const start = moment(startDate);
    const end = moment(endDate);
    
    if (format) {
        return `${start.format(format)} - ${end.format(format)}`;
    }
    
    // If same year, don't repeat the year
    if (start.year() === end.year()) {
        // If same month, don't repeat the month
        if (start.month() === end.month()) {
            return `${start.format('D')} - ${end.format('D MMMM YYYY')}`;
        }
        return `${start.format('D MMMM')} - ${end.format('D MMMM YYYY')}`;
    }
    
    return `${start.format('D MMMM YYYY')} - ${end.format('D MMMM YYYY')}`;
}

/**
 * Localizes week options
 * @param weekOptions - Array of week options
 * @param locale - Locale to use (optional, uses current locale if not provided)
 * @param dateFormat - Date format to use (optional)
 * @returns Array of localized week options with additional localized properties
 */
export function localizeWeekOptions(
    weekOptions: WeekOption[],
    locale?: string,
    dateFormat?: string
): (WeekOption & { localizedDateRange: string })[] {
    if (locale) {
        moment.locale(locale);
    }
    
    return weekOptions.map(week => {
        return {
            ...week,
            localizedDateRange: formatLocalizedDateRange(week.startTime, week.endTime, dateFormat)
        };
    });
}

/**
 * Localizes quarter options
 * @param quarterOptions - Array of quarter options
 * @param locale - Locale to use (optional, uses current locale if not provided)
 * @param dateFormat - Date format to use (optional)
 * @returns Array of localized quarter options with additional localized properties
 */
export function localizeQuarterOptions(
    quarterOptions: QuarterOption[],
    locale?: string,
    dateFormat?: string
): (QuarterOption & { localizedDateRange: string })[] {
    if (locale) {
        moment.locale(locale);
    }
    
    return quarterOptions.map(quarter => {
        return {
            ...quarter,
            localizedDateRange: formatLocalizedDateRange(quarter.startTime, quarter.endTime, dateFormat)
        };
    });
}

/**
 * Gets the localized quarter name
 * @param quarter - Quarter number (1-4)
 * @param locale - Locale (optional, uses current locale if not provided)
 * @returns The localized quarter name
 */
export function getLocalizedQuarterName(quarter: number, locale?: string): string {
    if (locale) {
        moment.locale(locale);
    }
    
    const quarterNames: Record<string, string[]> = {
        'en': ['First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter'],
        'fr': ['Premier Trimestre', 'Deuxième Trimestre', 'Troisième Trimestre', 'Quatrième Trimestre'],
        'es': ['Primer Trimestre', 'Segundo Trimestre', 'Tercer Trimestre', 'Cuarto Trimestre'],
        'de': ['Erstes Quartal', 'Zweites Quartal', 'Drittes Quartal', 'Viertes Quartal'],
        'it': ['Primo Trimestre', 'Secondo Trimestre', 'Terzo Trimestre', 'Quarto Trimestre'],
        'ja': ['第1四半期', '第2四半期', '第3四半期', '第4四半期'],
        'zh-cn': ['第一季度', '第二季度', '第三季度', '第四季度'],
        'pt': ['Primeiro Trimestre', 'Segundo Trimestre', 'Terceiro Trimestre', 'Quarto Trimestre'],
        'ru': ['Первый квартал', 'Второй квартал', 'Третий квартал', 'Четвертый квартал'],
        'ar': ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
        'hi': ['पहली तिमाही', 'दूसरी तिमाही', 'तीसरी तिमाही', 'चौथी तिमाही'],
        'ko': ['1분기', '2분기', '3분기', '4분기'],
    };
    
    const currentLocale = moment.locale();
    const fallbackLocale = 'en';
    
    if (quarterNames[currentLocale] && quarter >= 1 && quarter <= 4) {
        return quarterNames[currentLocale][quarter - 1];
    }
    
    return quarterNames[fallbackLocale][quarter - 1];
}
