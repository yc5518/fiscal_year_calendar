/**
 * Localization utilities for fiscal-year-calendar
 * Provides functions to format dates and calendar data in different languages
 */
import { Locale } from 'date-fns';
import { MonthOption, WeekOption, QuarterOption } from '../types';
import { DateInput } from './dateUtils';
export declare const AVAILABLE_LOCALES: Record<string, Locale>;
/**
 * Set the current locale
 * @param localeCode - The locale code to set
 * @returns True if the locale was set successfully, false otherwise
 */
export declare function setLocale(localeCode: string): boolean;
/**
 * Get the current locale
 * @returns The current locale code
 */
export declare function getLocale(): string;
/**
 * Get available locales
 * @returns Array of available locale codes
 */
export declare function getAvailableLocales(): string[];
/**
 * Format a date using the current locale
 * @param date - The date to format
 * @param formatStr - The format string
 * @returns The formatted date string
 */
export declare function formatLocalizedDate(date: DateInput, formatStr?: string): string;
/**
 * Get the localized month name
 * @param month - The month number (0-11)
 * @param formatType - The format ('long' or 'short')
 * @returns The localized month name
 */
export declare function getLocalizedMonthName(month: number, formatType?: 'long' | 'short'): string;
/**
 * Get the localized day name
 * @param day - The day of week (0-6, where 0 is Sunday)
 * @param formatType - The format ('long' or 'short')
 * @returns The localized day name
 */
export declare function getLocalizedDayName(day: number, formatType?: 'long' | 'short'): string;
/**
 * Get the localized quarter name
 * @param quarter - The quarter number (1-4)
 * @returns The localized quarter name
 */
export declare function getLocalizedQuarterName(quarter: number): string;
/**
 * Format a date range using the current locale
 * @param startDate - The start date
 * @param endDate - The end date
 * @param formatStr - The format string
 * @returns The formatted date range string
 */
export declare function formatLocalizedDateRange(startDate: DateInput, endDate: DateInput, formatStr?: string): string;
/**
 * Localize month options
 * @param months - The month options to localize
 * @returns The localized month options
 */
export declare function localizeMonthOptions(months: MonthOption[]): MonthOption[];
/**
 * Localize week options
 * @param weeks - The week options to localize
 * @returns The localized week options
 */
export declare function localizeWeekOptions(weeks: WeekOption[]): WeekOption[];
/**
 * Localize quarter options
 * @param quarters - The quarter options to localize
 * @returns The localized quarter options
 */
export declare function localizeQuarterOptions(quarters: QuarterOption[]): QuarterOption[];
