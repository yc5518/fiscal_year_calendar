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
    // Government Fiscal Years
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
    'brazil': {
        name: 'Brazil',
        fyStartMonth: 0, // January
        fyStartDay: 1,
        description: 'Brazilian fiscal year (Jan 1 - Dec 31)',
    },
    'south-africa': {
        name: 'South Africa',
        fyStartMonth: 2, // March
        fyStartDay: 1,
        description: 'South African fiscal year (Mar 1 - Feb 28/29)',
    },
    'sweden': {
        name: 'Sweden',
        fyStartMonth: 0, // January
        fyStartDay: 1,
        description: 'Swedish fiscal year (Jan 1 - Dec 31)',
    },
    'france': {
        name: 'France',
        fyStartMonth: 0, // January
        fyStartDay: 1,
        description: 'French fiscal year (Jan 1 - Dec 31)',
    },
    'germany': {
        name: 'Germany',
        fyStartMonth: 0, // January
        fyStartDay: 1,
        description: 'German fiscal year (Jan 1 - Dec 31)',
    },
    
    // Industry-specific Fiscal Years
    'retail-standard': {
        name: 'Retail Standard',
        fyStartMonth: 1, // February
        fyStartDay: 1,
        description: 'Standard retail fiscal year (Feb 1 - Jan 31)',
    },
    'retail-445': {
        name: 'Retail 4-4-5',
        fyStartMonth: 1, // February
        fyStartDay: 1,
        description: 'Retail 4-4-5 fiscal year (Feb 1 - Jan 31)',
    },
    'education-us': {
        name: 'US Education',
        fyStartMonth: 6, // July
        fyStartDay: 1,
        description: 'US education fiscal year (Jul 1 - Jun 30)',
    },
    'nonprofit-us': {
        name: 'US Nonprofit',
        fyStartMonth: 6, // July
        fyStartDay: 1,
        description: 'Common US nonprofit fiscal year (Jul 1 - Jun 30)',
    },
    'healthcare-us': {
        name: 'US Healthcare',
        fyStartMonth: 9, // October
        fyStartDay: 1,
        description: 'Common US healthcare fiscal year (Oct 1 - Sep 30)',
    },
    'tech-industry': {
        name: 'Technology Industry',
        fyStartMonth: 0, // January
        fyStartDay: 1,
        description: 'Common technology industry fiscal year (Jan 1 - Dec 31)',
    },
    'manufacturing': {
        name: 'Manufacturing',
        fyStartMonth: 9, // October
        fyStartDay: 1,
        description: 'Common manufacturing fiscal year (Oct 1 - Sep 30)',
    },
    'hospitality': {
        name: 'Hospitality',
        fyStartMonth: 0, // January
        fyStartDay: 1,
        description: 'Common hospitality industry fiscal year (Jan 1 - Dec 31)',
    },
    'construction': {
        name: 'Construction',
        fyStartMonth: 9, // October
        fyStartDay: 1,
        description: 'Common construction industry fiscal year (Oct 1 - Sep 30)',
    },
    'insurance': {
        name: 'Insurance',
        fyStartMonth: 0, // January
        fyStartDay: 1,
        description: 'Common insurance industry fiscal year (Jan 1 - Dec 31)',
    },
    
    // Standard Calendar Year
    'calendar-year': {
        name: 'Calendar Year',
        fyStartMonth: 0, // January
        fyStartDay: 1,
        description: 'Standard calendar year (Jan 1 - Dec 31)',
    },
};
