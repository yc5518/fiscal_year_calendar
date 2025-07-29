/**
 * TypeScript example demonstrating the localization functionality of fiscal-year-calendar
 */
import {
    getWeekOptions,
    getMonthOptions,
    getFiscalYearWithPreset,
    setLocale,
    getLocale,
    getAvailableLocales,
    formatLocalizedDate,
    getLocalizedMonthName,
    getLocalizedDayName,
    localizeMonthOptions,
    formatLocalizedDateRange,
    localizeWeekOptions,
    getLocalizedQuarterName,
    START_OF_WEEK,
    MonthOption,
    WeekOption
} from '../src';

console.log("=== Fiscal Year Calendar Localization Examples (TypeScript) ===\n");

// Example 1: Get available locales with TypeScript
console.log("Example 1: Available Locales");
const availableLocales: string[] = getAvailableLocales();
console.log(`Available locales: ${availableLocales.join(', ')}`);
console.log("\n");

// Example 2: Set and get locale with TypeScript
console.log("Example 2: Set and Get Locale");
console.log(`Current locale: ${getLocale()}`);
setLocale('fr');
console.log(`After setting to French: ${getLocale()}`);
console.log("\n");

// Example 3: Format dates according to locale with TypeScript
console.log("Example 3: Format Dates According to Locale");
const date: Date = new Date(2025, 9, 15); // October 15, 2025
console.log("Date: October 15, 2025");

setLocale('en');
console.log(`English format: ${formatLocalizedDate(date)}`);

setLocale('fr');
console.log(`French format: ${formatLocalizedDate(date)}`);

setLocale('de');
console.log(`German format: ${formatLocalizedDate(date)}`);

setLocale('es');
console.log(`Spanish format: ${formatLocalizedDate(date)}`);
console.log("\n");

// Example 4: Get localized month names with TypeScript
console.log("Example 4: Localized Month Names");
setLocale('en');
console.log("English month names:");
for (let i = 0; i < 12; i++) {
    console.log(`Month ${i + 1}: ${getLocalizedMonthName(i)}`);
}

console.log("\nFrench month names:");
setLocale('fr');
for (let i = 0; i < 12; i++) {
    console.log(`Month ${i + 1}: ${getLocalizedMonthName(i)}`);
}
console.log("\n");

// Example 5: Get localized day names with TypeScript
console.log("Example 5: Localized Day Names");
setLocale('en');
console.log("English day names:");
for (let i = 0; i < 7; i++) {
    console.log(`Day ${i}: ${getLocalizedDayName(i)}`);
}

console.log("\nGerman day names:");
setLocale('de');
for (let i = 0; i < 7; i++) {
    console.log(`Day ${i}: ${getLocalizedDayName(i)}`);
}
console.log("\n");

// Example 6: Localize month options with TypeScript
console.log("Example 6: Localized Month Options");
setLocale('en');
const year = 2025;
const monthOptions: MonthOption[] = getMonthOptions(
    START_OF_WEEK.monday.value,
    null,
    year
);

console.log("Original month options (first 3):");
console.log(monthOptions.slice(0, 3));

setLocale('es');
const localizedMonths: MonthOption[] = localizeMonthOptions(monthOptions);
console.log("\nLocalized month options in Spanish (first 3):");
console.log(localizedMonths.slice(0, 3));
console.log("\n");

// Example 7: Format localized date ranges with TypeScript
console.log("Example 7: Localized Date Ranges");
const startDate: Date = new Date(2025, 0, 15); // January 15, 2025
const endDate: Date = new Date(2025, 1, 20);   // February 20, 2025

setLocale('en');
console.log(`English date range: ${formatLocalizedDateRange(startDate, endDate)}`);

setLocale('fr');
console.log(`French date range: ${formatLocalizedDateRange(startDate, endDate)}`);

setLocale('de');
console.log(`German date range: ${formatLocalizedDateRange(startDate, endDate)}`);
console.log("\n");

// Example 8: Localize week options with TypeScript
console.log("Example 8: Localized Week Options");
setLocale('en');
const weekOptions: WeekOption[] = getWeekOptions(
    START_OF_WEEK.monday.value,
    null,
    year
);

const localizedWeeks = localizeWeekOptions(weekOptions.slice(0, 3));
console.log("Localized week options (first 3):");
localizedWeeks.forEach(week => {
    console.log(`Week ${week.week}: ${week.localizedDateRange}`);
});
console.log("\n");

// Example 9: Localized quarter names with TypeScript
console.log("Example 9: Localized Quarter Names");
setLocale('en');
console.log("English quarter names:");
for (let i = 1; i <= 4; i++) {
    console.log(`Quarter ${i}: ${getLocalizedQuarterName(i)}`);
}

console.log("\nJapanese quarter names:");
setLocale('ja');
for (let i = 1; i <= 4; i++) {
    console.log(`Quarter ${i}: ${getLocalizedQuarterName(i)}`);
}
console.log("\n");

// Example 10: Combining localization with fiscal year presets with TypeScript
console.log("Example 10: Localized Fiscal Year Presets");
setLocale('fr');
const usPreset = getFiscalYearWithPreset("us-federal", null, year);
const localizedPresetMonths = localizeMonthOptions(usPreset.months);

console.log(`US Federal Government fiscal year ${year} months in French (first 3):`);
localizedPresetMonths.slice(0, 3).forEach(month => {
    console.log(`Month ${month.month}: ${month.name}, ${formatLocalizedDateRange(month.startTime, month.endTime)}`);
});

// Example 11: Type safety with TypeScript
console.log("Example 11: Type Safety with TypeScript");
// This demonstrates TypeScript's type checking capabilities
interface LocalizedMonthInfo {
    monthNumber: string;
    name: string;
    dateRange: string;
}

// Create a strongly typed array of localized month information
const typedMonthInfo: LocalizedMonthInfo[] = localizedPresetMonths.slice(0, 3).map(month => ({
    monthNumber: month.month,
    name: month.name,
    dateRange: formatLocalizedDateRange(month.startTime, month.endTime)
}));

console.log("Strongly typed localized month information:");
console.log(typedMonthInfo);

// Reset locale to English
setLocale('en');

// To run this example: ts-node examples/localization.example.ts
