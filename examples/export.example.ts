/**
 * TypeScript example demonstrating the export functionality of fiscal-year-calendar
 */
import {
    getWeekOptions,
    getQuarterOptions,
    getMonthOptions,
    getRetailCalendarOptions,
    getFiscalYearWithPreset,
    exportToCSV,
    exportToJSON,
    exportToICal,
    exportToHTML,
    START_OF_WEEK,
    CALENDAR_SYSTEMS,
    WeekOption,
    QuarterOption,
    MonthOption,
    PeriodOption
} from '../src';

console.log("=== Fiscal Year Calendar Export Examples (TypeScript) ===\n");

// Get fiscal year data to export
const year = 2025;
const weekOptions = getWeekOptions(
    START_OF_WEEK.monday.value,
    null,
    year
);
const quarterOptions = getQuarterOptions(
    START_OF_WEEK.monday.value,
    null,
    year
);
const monthOptions = getMonthOptions(
    START_OF_WEEK.monday.value,
    null,
    year
);

// Example 1: Export weeks to CSV with TypeScript type safety
console.log("Example 1: Export weeks to CSV with TypeScript");
const weeksCSV = exportToCSV<WeekOption>(weekOptions, {
    dateFormat: 'YYYY-MM-DD',
    includeHeaders: true,
    delimiter: ','
});
console.log("CSV output (first 3 rows):");
console.log(weeksCSV.split('\n').slice(0, 4).join('\n'));
console.log("...");
console.log("\n");

// Example 2: Export quarters to JSON with TypeScript type safety
console.log("Example 2: Export quarters to JSON with TypeScript");
const quartersJSON = exportToJSON<QuarterOption>(quarterOptions, {
    dateFormat: 'YYYY-MM-DD',
    pretty: true
});
console.log("JSON output:");
console.log(quartersJSON);
console.log("\n");

// Example 3: Export months to iCalendar with TypeScript type safety
console.log("Example 3: Export months to iCalendar with TypeScript");
const monthsICal = exportToICal<MonthOption>(monthOptions, {
    calendarName: `Fiscal Year ${year} Months`,
    eventPrefix: 'FY'
});
console.log("iCalendar output (first 15 lines):");
console.log(monthsICal.split('\r\n').slice(0, 15).join('\r\n'));
console.log("...");
console.log("\n");

// Example 4: Export months to HTML with TypeScript type safety
console.log("Example 4: Export months to HTML with TypeScript");
const monthsHTML = exportToHTML<MonthOption>(monthOptions, {
    title: `Fiscal Year ${year} Months`,
    dateFormat: 'MMMM D, YYYY',
    includeStyles: true
});
console.log("HTML output (truncated):");
console.log(monthsHTML.substring(0, 500) + "...");
console.log("\n");

// Example 5: Export with different date formats
console.log("Example 5: Export with different date formats");
const formattedCSV = exportToCSV<MonthOption>(monthOptions.slice(0, 3), {
    dateFormat: 'MMM DD, YYYY'
});
console.log("CSV with formatted dates:");
console.log(formattedCSV);
console.log("\n");

// Example 6: Export retail calendar with TypeScript type safety
console.log("Example 6: Export retail calendar with TypeScript");
const retailCalendar = getRetailCalendarOptions(
    START_OF_WEEK.monday.value,
    null,
    year,
    CALENDAR_SYSTEMS.RETAIL_445 as any
);
const retailJSON = exportToJSON<PeriodOption>(retailCalendar, {
    dateFormat: 'YYYY-MM-DD',
    pretty: true
});
console.log("Retail calendar JSON (first period):");
console.log(JSON.stringify(JSON.parse(retailJSON)[0], null, 2));
console.log("\n");

// Example 7: Export using a fiscal year preset
console.log("Example 7: Export using a fiscal year preset");
const usPreset = getFiscalYearWithPreset("us-federal", null, year);
const presetCSV = exportToCSV<MonthOption>(usPreset.months, {
    dateFormat: 'YYYY-MM-DD'
});
console.log(`US Federal Government fiscal year ${year} months (CSV):`);
console.log(presetCSV.split('\n').slice(0, 4).join('\n'));
console.log("...");

// Example 8: Combining multiple export formats
console.log("Example 8: Combining multiple export formats");

// First export to JSON
const jsonData = exportToJSON<MonthOption>(monthOptions, { pretty: true });
console.log("Exported to JSON, then can be used in other applications or stored");

// Then export the same data to HTML for display
const htmlFromJson = exportToHTML<MonthOption>(monthOptions, {
    title: "Fiscal Calendar from JSON Data",
    dateFormat: 'MMMM D, YYYY'
});
console.log("Same data exported to HTML for display (truncated):");
console.log(htmlFromJson.substring(0, 200) + "...");
console.log("\n");

// To run this example: ts-node examples/export.example.ts
