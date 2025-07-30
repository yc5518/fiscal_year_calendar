/**
 * Localization Example (TypeScript)
 * 
 * This example demonstrates how to use the localization features
 * to format dates and calendar data in different languages.
 */

import {
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
  START_OF_WEEK,
  WeekOption,
  MonthOption,
  QuarterOption,
  FiscalYearConfig
} from 'fiscal-year-calendar';

// Example 1: Display available locales
function displayAvailableLocales(): void {
  console.log('Available Locales:');
  const locales: string[] = getAvailableLocales();
  locales.forEach(locale => {
    console.log(`- ${locale}`);
  });
  console.log();
}

// Example 2: Format dates in different locales
function formatDatesInDifferentLocales(): void {
  const today: Date = new Date();
  const locales: string[] = getAvailableLocales();
  
  console.log('Today\'s date in different locales:');
  locales.forEach(locale => {
    setLocale(locale);
    console.log(`${locale}: ${formatLocalizedDate(today)}`);
  });
  console.log();
}

// Example 3: Display month names in different locales
function displayMonthNamesInDifferentLocales(): void {
  const locales: string[] = ['en-US', 'fr', 'ja', 'ru'];
  
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
function displayDayNamesInDifferentLocales(): void {
  const locales: string[] = ['en-US', 'de', 'zh-CN', 'es'];
  
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
function formatDateRangesInDifferentLocales(): void {
  const startDate: Date = new Date(2025, 0, 1); // Jan 1, 2025
  const endDate: Date = new Date(2025, 11, 31); // Dec 31, 2025
  const locales: string[] = ['en-US', 'fr', 'ja', 'de'];
  
  console.log('Date ranges in different locales:');
  locales.forEach(locale => {
    setLocale(locale);
    console.log(`${locale}: ${formatLocalizedDateRange(startDate, endDate)}`);
  });
  console.log();
}

// Example 6: Localize fiscal year data
function localizeFiscalYearData(): void {
  // Get fiscal year configuration using preset
  const config: FiscalYearConfig = getFiscalYearWithPreset('us-federal');
  const currentYear: number = new Date().getFullYear();
  
  // Get calendar data
  const months: MonthOption[] = getMonthOptions(
    START_OF_WEEK.monday.value,
    null,
    currentYear,
    config.fyStartMonth,
    config.fyStartDay
  );
  
  const quarters: QuarterOption[] = getQuarterOptions(
    START_OF_WEEK.monday.value,
    null,
    currentYear,
    config.fyStartMonth,
    config.fyStartDay
  );
  
  const weeks: WeekOption[] = getWeekOptions(
    START_OF_WEEK.monday.value,
    null,
    currentYear,
    config.fyStartMonth,
    config.fyStartDay
  );
  
  // Localize data in different locales
  const locales: string[] = ['en-US', 'fr', 'ja'];
  
  locales.forEach(locale => {
    setLocale(locale);
    console.log(`\nFiscal Year Data in ${locale}:`);
    
    // Localize months
    const localizedMonths: MonthOption[] = localizeMonthOptions(months);
    console.log('\nMonths:');
    localizedMonths.slice(0, 3).forEach(month => {
      console.log(`Month ${month.month}: ${month.name} (${formatLocalizedDateRange(month.startTime, month.endTime, 'P')})`);
    });
    
    // Localize quarters
    const localizedQuarters: QuarterOption[] = localizeQuarterOptions(quarters);
    console.log('\nQuarters:');
    localizedQuarters.forEach(quarter => {
      console.log(`${quarter.quarter}: ${formatLocalizedDateRange(quarter.startTime, quarter.endTime, 'P')}`);
    });
    
    // Localize weeks (showing just first 3)
    const localizedWeeks: WeekOption[] = localizeWeekOptions(weeks);
    console.log('\nWeeks (first 3):');
    localizedWeeks.slice(0, 3).forEach(week => {
      console.log(`Week ${week.week}: ${formatLocalizedDateRange(week.startTime, week.endTime, 'P')}`);
    });
  });
}

// Example 7: Display quarter names in different locales
function displayQuarterNamesInDifferentLocales(): void {
  const locales: string[] = ['en-US', 'fr', 'ja', 'ru', 'zh-CN'];
  
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
function runAllExamples(): void {
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
