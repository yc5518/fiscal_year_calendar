/**
 * Constants for fiscal-year-calendar library
 */
import { StartOfWeek, FiscalYearPreset } from '../types';

// Default fiscal year start month (0-based, 9 = October)
export const DEFAULT_FY_START_MONTH = 9;
export const DEFAULT_FY_START_DAY = 1;

// With customised locale
// E.g.: when we set the first day of a week to be Sunday, 0 represents **Sunday**;
// when we set the first day of a week to be Monday, 0 represents **Monday**.
export const FIRST_DAY_NUM_OF_WEEK = 0;

export const START_OF_WEEK: StartOfWeek = Object.freeze({
    monday: {
        value: "monday",
        label: "Monday",
    },
    sunday: {
        value: "sunday",
        label: "Sunday",
    },
    saturday: {
        value: "saturday",
        label: "Saturday",
    },
});

// Calendar system types
export const CALENDAR_SYSTEMS = {
    STANDARD: 'standard',
    RETAIL_445: '4-4-5',
    RETAIL_454: '4-5-4',
    RETAIL_544: '5-4-4',
};

// Common fiscal year presets
export const FISCAL_YEAR_PRESETS: Record<string, FiscalYearPreset> = {
    'us-federal': {
        name: 'US Federal Government',
        fyStartMonth: 9, // October
        fyStartDay: 1,
        description: 'US Federal Government fiscal year (Oct 1 - Sep 30)',
    },
    'uk-standard': {
        name: 'UK Standard',
        fyStartMonth: 3, // April
        fyStartDay: 6,
        description: 'UK standard fiscal year (Apr 6 - Apr 5)',
    },
    'australia': {
        name: 'Australia',
        fyStartMonth: 6, // July
        fyStartDay: 1,
        description: 'Australian fiscal year (Jul 1 - Jun 30)',
    },
    'india': {
        name: 'India',
        fyStartMonth: 3, // April
        fyStartDay: 1,
        description: 'Indian fiscal year (Apr 1 - Mar 31)',
    },
    'japan': {
        name: 'Japan',
        fyStartMonth: 3, // April
        fyStartDay: 1,
        description: 'Japanese fiscal year (Apr 1 - Mar 31)',
    },
    'canada': {
        name: 'Canada',
        fyStartMonth: 3, // April
        fyStartDay: 1,
        description: 'Canadian fiscal year (Apr 1 - Mar 31)',
    },
    'new-zealand': {
        name: 'New Zealand',
        fyStartMonth: 3, // April
        fyStartDay: 1,
        description: 'New Zealand fiscal year (Apr 1 - Mar 31)',
    },
    'singapore': {
        name: 'Singapore',
        fyStartMonth: 3, // April
        fyStartDay: 1,
        description: 'Singapore fiscal year (Apr 1 - Mar 31)',
    },
    'calendar-year': {
        name: 'Calendar Year',
        fyStartMonth: 0, // January
        fyStartDay: 1,
        description: 'Standard calendar year (Jan 1 - Dec 31)',
    },
};
