/**
 * Localization Example
 * 
 * This example demonstrates how to use the localization features
 * to format dates and calendar data in different languages.
 */

const {
  getWeekOptions,
  getMonthOptions,
  getQuarterOptions,
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
  localizeQuarterOptions,
  getLocalizedQuarterName,
  FISCAL_YEAR_PRESETS,
  START_OF_WEEK
} = require('fiscal-year-calendar');

// Example 1: Display available locales
function displayAvailableLocales() {
  console.log('Available Locales:');
  const locales = getAvailableLocales();
  locales.forEach(locale => {
    console.log(`- ${locale}`);
  });
  console.log();
}

// Example 2: Format dates in different locales
function formatDatesInDifferentLocales() {
  const today = new Date();
  const locales = getAvailableLocales();
  
  console.log('Today\'s date in different locales:');
  locales.forEach(locale => {
    setLocale(locale);
    console.log(`${locale}: ${formatLocalizedDate(today)}`);
  });
  console.log();
}

// Example 3: Display month names in different locales
function displayMonthNamesInDifferentLocales() {
  const locales = ['en-US', 'fr', 'ja', 'ru'];
  
  console.log('Month names in different locales:');
  locales.forEach(locale => {
    setLocale(locale);
    console.log(`\n${locale}:`);
    for (let month = 0; month < 12; month++) {
      console.log(`${month + 1}: ${getLocalizedMonthName(month)}`);
    }
  });
  console.log();
}

// Example 4: Display day names in different locales
function displayDayNamesInDifferentLocales() {
  const locales = ['en-US', 'de', 'zh-CN', 'es'];
  
  console.log('Day names in different locales:');
  locales.forEach(locale => {
    setLocale(locale);
    console.log(`\n${locale}:`);
    for (let day = 0; day < 7; day++) {
      console.log(`${day}: ${getLocalizedDayName(day)}`);
    }
  });
  console.log();
}

// Example 5: Format date ranges in different locales
function formatDateRangesInDifferentLocales() {
  const startDate = new Date(2025, 0, 1); // Jan 1, 2025
  const endDate = new Date(2025, 11, 31); // Dec 31, 2025
  const locales = ['en-US', 'fr', 'ja', 'de'];
  
  console.log('Date ranges in different locales:');
  locales.forEach(locale => {
    setLocale(locale);
    console.log(`${locale}: ${formatLocalizedDateRange(startDate, endDate)}`);
  });
  console.log();
}

// Example 6: Localize fiscal year data
function localizeFiscalYearData() {
  // Get fiscal year configuration using preset
  const config = getFiscalYearWithPreset('us-federal');
  const currentYear = new Date().getFullYear();
  
  // Get calendar data
  const months = getMonthOptions(
    START_OF_WEEK.monday.value,
    null,
    currentYear,
    config.fyStartMonth,
    config.fyStartDay
  );
  
  const quarters = getQuarterOptions(
    START_OF_WEEK.monday.value,
    null,
    currentYear,
    config.fyStartMonth,
    config.fyStartDay
  );
  
  const weeks = getWeekOptions(
    START_OF_WEEK.monday.value,
    null,
    currentYear,
    config.fyStartMonth,
    config.fyStartDay
  );
  
  // Localize data in different locales
  const locales = ['en-US', 'fr', 'ja'];
  
  locales.forEach(locale => {
    setLocale(locale);
    console.log(`\nFiscal Year Data in ${locale}:`);
    
    // Localize months
    const localizedMonths = localizeMonthOptions(months);
    console.log('\nMonths:');
    localizedMonths.slice(0, 3).forEach(month => {
      console.log(`Month ${month.month}: ${month.name} (${formatLocalizedDateRange(month.startTime, month.endTime, 'P')})`);
    });
    
    // Localize quarters
    const localizedQuarters = localizeQuarterOptions(quarters);
    console.log('\nQuarters:');
    localizedQuarters.forEach(quarter => {
      console.log(`${quarter.quarter}: ${formatLocalizedDateRange(quarter.startTime, quarter.endTime, 'P')}`);
    });
    
    // Localize weeks (showing just first 3)
    const localizedWeeks = localizeWeekOptions(weeks);
    console.log('\nWeeks (first 3):');
    localizedWeeks.slice(0, 3).forEach(week => {
      console.log(`Week ${week.week}: ${formatLocalizedDateRange(week.startTime, week.endTime, 'P')}`);
    });
  });
}

// Example 7: Display quarter names in different locales
function displayQuarterNamesInDifferentLocales() {
  const locales = ['en-US', 'fr', 'ja', 'ru', 'zh-CN'];
  
  console.log('Quarter names in different locales:');
  locales.forEach(locale => {
    setLocale(locale);
    console.log(`\n${locale}:`);
    for (let quarter = 1; quarter <= 4; quarter++) {
      console.log(`${quarter}: ${getLocalizedQuarterName(quarter)}`);
    }
  });
  console.log();
}

// Run all examples
function runAllExamples() {
  displayAvailableLocales();
  formatDatesInDifferentLocales();
  displayMonthNamesInDifferentLocales();
  displayDayNamesInDifferentLocales();
  formatDateRangesInDifferentLocales();
  displayQuarterNamesInDifferentLocales();
  localizeFiscalYearData();
}

// Run the examples
runAllExamples();
