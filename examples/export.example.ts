/**
 * Export Example (TypeScript)
 * 
 * This example demonstrates how to export fiscal calendar data to various formats
 * including CSV, JSON, iCal, and HTML using TypeScript.
 */

import {
  getWeekOptions,
  getMonthOptions,
  getQuarterOptions,
  getFiscalYearWithPreset,
  exportToCSV,
  exportToJSON,
  exportToICal,
  exportToHTML,
  FISCAL_YEAR_PRESETS,
  START_OF_WEEK,
  WeekOption,
  MonthOption,
  QuarterOption,
  FiscalYearConfig
} from 'fiscal-year-calendar';
import * as fs from 'fs';
import * as path from 'path';

// Create output directory if it doesn't exist
const outputDir: string = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Example 1: Export US Federal Government fiscal year to CSV
function exportUSFederalToCSV(): string {
  console.log('Exporting US Federal Government fiscal year to CSV...');
  
  // Get fiscal year configuration using preset
  const config: FiscalYearConfig = getFiscalYearWithPreset('us-federal');
  const currentYear: number = new Date().getFullYear();
  
  // Get month options for the fiscal year
  const months: MonthOption[] = getMonthOptions(
    START_OF_WEEK.monday.value,
    null,
    currentYear,
    config.fyStartMonth,
    config.fyStartDay
  );
  
  // Export to CSV
  const csvData: string = exportToCSV(months, {
    headers: ['Month Number', 'Month Name', 'Start Date', 'End Date'],
    fields: ['month', 'name', 'startTime', 'endTime'],
    filename: path.join(outputDir, 'us_federal_months.csv')
  });
  
  console.log('CSV export complete!');
  return csvData;
}

// Example 2: Export UK fiscal year quarters to JSON
function exportUKQuartersToJSON(): string {
  console.log('Exporting UK fiscal year quarters to JSON...');
  
  // Get fiscal year configuration using preset
  const config: FiscalYearConfig = getFiscalYearWithPreset('uk-standard');
  const currentYear: number = new Date().getFullYear();
  
  // Get quarter options for the fiscal year
  const quarters: QuarterOption[] = getQuarterOptions(
    START_OF_WEEK.monday.value,
    null,
    currentYear,
    config.fyStartMonth,
    config.fyStartDay
  );
  
  // Export to JSON
  const jsonData: string = exportToJSON(quarters, {
    filename: path.join(outputDir, 'uk_quarters.json'),
    pretty: true // Format JSON with indentation
  });
  
  console.log('JSON export complete!');
  return jsonData;
}

// Example 3: Export Australian fiscal year weeks to iCal
function exportAustralianWeeksToICal(): string {
  console.log('Exporting Australian fiscal year weeks to iCal...');
  
  // Get fiscal year configuration using preset
  const config: FiscalYearConfig = getFiscalYearWithPreset('australia');
  const currentYear: number = new Date().getFullYear();
  
  // Get week options for the fiscal year
  const weeks: WeekOption[] = getWeekOptions(
    START_OF_WEEK.monday.value,
    null,
    currentYear,
    config.fyStartMonth,
    config.fyStartDay
  );
  
  // Export to iCal
  const iCalData: string = exportToICal(weeks, {
    filename: path.join(outputDir, 'australian_weeks.ics'),
    calendarName: 'Australian Fiscal Year',
    eventNamePrefix: 'Week ',
    eventNameField: 'week',
    startTimeField: 'startTime',
    endTimeField: 'endTime',
    description: 'Australian Fiscal Year Week'
  });
  
  console.log('iCal export complete!');
  return iCalData;
}

// Example 4: Export Calendar Year to HTML
function exportCalendarYearToHTML(): string {
  console.log('Exporting Calendar Year to HTML...');
  
  // Get fiscal year configuration using preset
  const config: FiscalYearConfig = getFiscalYearWithPreset('calendar-year');
  const currentYear: number = new Date().getFullYear();
  
  // Get month options for the fiscal year
  const months: MonthOption[] = getMonthOptions(
    START_OF_WEEK.monday.value,
    null,
    currentYear,
    config.fyStartMonth,
    config.fyStartDay
  );
  
  // Export to HTML
  const htmlData: string = exportToHTML(months, {
    filename: path.join(outputDir, 'calendar_year.html'),
    title: 'Calendar Year',
    tableHeaders: ['Month', 'Name', 'Start Date', 'End Date'],
    tableFields: ['month', 'name', 'startTime', 'endTime'],
    cssStyles: `
      body { font-family: Arial, sans-serif; margin: 20px; }
      h1 { color: #2c3e50; }
      table { border-collapse: collapse; width: 100%; }
      th { background-color: #3498db; color: white; }
      th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
      tr:nth-child(even) { background-color: #f2f2f2; }
    `
  });
  
  console.log('HTML export complete!');
  return htmlData;
}

// Example 5: Export custom fiscal year with all periods
function exportCustomFiscalYear(): string {
  console.log('Exporting custom fiscal year with all periods...');
  
  // Custom fiscal year configuration (July 1)
  const config: FiscalYearConfig = {
    fyStartMonth: 6, // July (0-based)
    fyStartDay: 1
  };
  const currentYear: number = new Date().getFullYear();
  
  // Get all period options
  const weeks: WeekOption[] = getWeekOptions(
    START_OF_WEEK.monday.value,
    null,
    currentYear,
    config.fyStartMonth,
    config.fyStartDay
  );
  
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
  
  // Define the structure for our custom fiscal year data
  interface CustomFiscalYearData {
    fiscalYear: number;
    config: FiscalYearConfig;
    periods: {
      weeks: WeekOption[];
      months: MonthOption[];
      quarters: QuarterOption[];
    };
  }
  
  // Create the data object
  const fiscalYearData: CustomFiscalYearData = {
    fiscalYear: currentYear,
    config,
    periods: {
      weeks,
      months,
      quarters
    }
  };
  
  // Export all periods to JSON
  const jsonData: string = exportToJSON(fiscalYearData, {
    filename: path.join(outputDir, 'custom_fiscal_year.json'),
    pretty: true
  });
  
  console.log('Custom fiscal year export complete!');
  return jsonData;
}

// Run all examples
function runAllExamples(): void {
  exportUSFederalToCSV();
  exportUKQuartersToJSON();
  exportAustralianWeeksToICal();
  exportCalendarYearToHTML();
  exportCustomFiscalYear();
  
  console.log(`All exports completed! Files saved to: ${outputDir}`);
}

// Run the examples
runAllExamples();
