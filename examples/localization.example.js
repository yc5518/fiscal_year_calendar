/**
 * Example demonstrating the localization functionality of fiscal-year-calendar
 */
const fiscalYear = require("../index");

console.log("=== Fiscal Year Calendar Localization Examples ===\n");

// Example 1: Get available locales
console.log("Example 1: Available Locales");
const availableLocales = fiscalYear.getAvailableLocales();
console.log(`Available locales: ${availableLocales.join(', ')}`);
console.log("\n");

// Example 2: Set and get locale
console.log("Example 2: Set and Get Locale");
console.log(`Current locale: ${fiscalYear.getLocale()}`);
fiscalYear.setLocale('fr');
console.log(`After setting to French: ${fiscalYear.getLocale()}`);
console.log("\n");

// Example 3: Format dates according to locale
console.log("Example 3: Format Dates According to Locale");
const date = new Date(2025, 9, 15); // October 15, 2025
console.log("Date: October 15, 2025");

fiscalYear.setLocale('en');
console.log(`English format: ${fiscalYear.formatLocalizedDate(date)}`);

fiscalYear.setLocale('fr');
console.log(`French format: ${fiscalYear.formatLocalizedDate(date)}`);

fiscalYear.setLocale('de');
console.log(`German format: ${fiscalYear.formatLocalizedDate(date)}`);

fiscalYear.setLocale('es');
console.log(`Spanish format: ${fiscalYear.formatLocalizedDate(date)}`);
console.log("\n");

// Example 4: Get localized month names
console.log("Example 4: Localized Month Names");
fiscalYear.setLocale('en');
console.log("English month names:");
for (let i = 0; i < 12; i++) {
    console.log(`Month ${i + 1}: ${fiscalYear.getLocalizedMonthName(i)}`);
}

console.log("\nFrench month names:");
fiscalYear.setLocale('fr');
for (let i = 0; i < 12; i++) {
    console.log(`Month ${i + 1}: ${fiscalYear.getLocalizedMonthName(i)}`);
}
console.log("\n");

// Example 5: Get localized day names
console.log("Example 5: Localized Day Names");
fiscalYear.setLocale('en');
console.log("English day names:");
for (let i = 0; i < 7; i++) {
    console.log(`Day ${i}: ${fiscalYear.getLocalizedDayName(i)}`);
}

console.log("\nGerman day names:");
fiscalYear.setLocale('de');
for (let i = 0; i < 7; i++) {
    console.log(`Day ${i}: ${fiscalYear.getLocalizedDayName(i)}`);
}
console.log("\n");

// Example 6: Localize month options
console.log("Example 6: Localized Month Options");
fiscalYear.setLocale('en');
const year = 2025;
const monthOptions = fiscalYear.getMonthOptions(
    fiscalYear.START_OF_WEEK.monday.value,
    null,
    year
);

console.log("Original month options (first 3):");
console.log(monthOptions.slice(0, 3));

fiscalYear.setLocale('es');
const localizedMonths = fiscalYear.localizeMonthOptions(monthOptions);
console.log("\nLocalized month options in Spanish (first 3):");
console.log(localizedMonths.slice(0, 3));
console.log("\n");

// Example 7: Format localized date ranges
console.log("Example 7: Localized Date Ranges");
const startDate = new Date(2025, 0, 15); // January 15, 2025
const endDate = new Date(2025, 1, 20);   // February 20, 2025

fiscalYear.setLocale('en');
console.log(`English date range: ${fiscalYear.formatLocalizedDateRange(startDate, endDate)}`);

fiscalYear.setLocale('fr');
console.log(`French date range: ${fiscalYear.formatLocalizedDateRange(startDate, endDate)}`);

fiscalYear.setLocale('de');
console.log(`German date range: ${fiscalYear.formatLocalizedDateRange(startDate, endDate)}`);
console.log("\n");

// Example 8: Localize week options
console.log("Example 8: Localized Week Options");
fiscalYear.setLocale('en');
const weekOptions = fiscalYear.getWeekOptions(
    fiscalYear.START_OF_WEEK.monday.value,
    null,
    year
);

const localizedWeeks = fiscalYear.localizeWeekOptions(weekOptions.slice(0, 3));
console.log("Localized week options (first 3):");
localizedWeeks.forEach(week => {
    console.log(`Week ${week.week}: ${week.localizedDateRange}`);
});
console.log("\n");

// Example 9: Localized quarter names
console.log("Example 9: Localized Quarter Names");
fiscalYear.setLocale('en');
console.log("English quarter names:");
for (let i = 1; i <= 4; i++) {
    console.log(`Quarter ${i}: ${fiscalYear.getLocalizedQuarterName(i)}`);
}

console.log("\nJapanese quarter names:");
fiscalYear.setLocale('ja');
for (let i = 1; i <= 4; i++) {
    console.log(`Quarter ${i}: ${fiscalYear.getLocalizedQuarterName(i)}`);
}
console.log("\n");

// Example 10: Combining localization with fiscal year presets
console.log("Example 10: Localized Fiscal Year Presets");
fiscalYear.setLocale('fr');
const usPreset = fiscalYear.getFiscalYearWithPreset("us-federal", null, year);
const localizedPresetMonths = fiscalYear.localizeMonthOptions(usPreset.months);

console.log(`US Federal Government fiscal year ${year} months in French (first 3):`);
localizedPresetMonths.slice(0, 3).forEach(month => {
    console.log(`Month ${month.month}: ${month.name}, ${fiscalYear.formatLocalizedDateRange(month.startTime, month.endTime)}`);
});

// Reset locale to English
fiscalYear.setLocale('en');

// To run this example: node examples/localization.example.js
