/**
 * Example demonstrating the export functionality of fiscal-year-calendar
 */
const fiscalYear = require("../index");

console.log("=== Fiscal Year Calendar Export Examples ===\n");

// Get fiscal year data to export
const year = 2025;
const weekOptions = fiscalYear.getWeekOptions(
    fiscalYear.START_OF_WEEK.monday.value,
    null,
    year
);
const quarterOptions = fiscalYear.getQuarterOptions(
    fiscalYear.START_OF_WEEK.monday.value,
    null,
    year
);
const monthOptions = fiscalYear.getMonthOptions(
    fiscalYear.START_OF_WEEK.monday.value,
    null,
    year
);

// Example 1: Export weeks to CSV
console.log("Example 1: Export weeks to CSV");
const weeksCSV = fiscalYear.exportToCSV(weekOptions, {
    dateFormat: 'YYYY-MM-DD',
    includeHeaders: true,
    delimiter: ','
});
console.log("CSV output (first 3 rows):");
console.log(weeksCSV.split('\n').slice(0, 4).join('\n'));
console.log("...");
console.log("\n");

// Example 2: Export quarters to JSON
console.log("Example 2: Export quarters to JSON");
const quartersJSON = fiscalYear.exportToJSON(quarterOptions, {
    dateFormat: 'YYYY-MM-DD',
    pretty: true
});
console.log("JSON output:");
console.log(quartersJSON);
console.log("\n");

// Example 3: Export months to iCalendar
console.log("Example 3: Export months to iCalendar");
const monthsICal = fiscalYear.exportToICal(monthOptions, {
    calendarName: `Fiscal Year ${year} Months`,
    eventPrefix: 'FY'
});
console.log("iCalendar output (first 15 lines):");
console.log(monthsICal.split('\r\n').slice(0, 15).join('\r\n'));
console.log("...");
console.log("\n");

// Example 4: Export months to HTML
console.log("Example 4: Export months to HTML");
const monthsHTML = fiscalYear.exportToHTML(monthOptions, {
    title: `Fiscal Year ${year} Months`,
    dateFormat: 'MMMM D, YYYY',
    includeStyles: true
});
console.log("HTML output (truncated):");
console.log(monthsHTML.substring(0, 500) + "...");
console.log("\n");

// Example 5: Export with different date formats
console.log("Example 5: Export with different date formats");
const formattedCSV = fiscalYear.exportToCSV(monthOptions.slice(0, 3), {
    dateFormat: 'MMM DD, YYYY'
});
console.log("CSV with formatted dates:");
console.log(formattedCSV);
console.log("\n");

// Example 6: Export retail calendar
console.log("Example 6: Export retail calendar");
const retailCalendar = fiscalYear.getRetailCalendarOptions(
    fiscalYear.START_OF_WEEK.monday.value,
    null,
    year,
    fiscalYear.CALENDAR_SYSTEMS.RETAIL_445
);
const retailJSON = fiscalYear.exportToJSON(retailCalendar, {
    dateFormat: 'YYYY-MM-DD',
    pretty: true
});
console.log("Retail calendar JSON (first period):");
console.log(JSON.stringify(JSON.parse(retailJSON)[0], null, 2));
console.log("\n");

// Example 7: Export using a fiscal year preset
console.log("Example 7: Export using a fiscal year preset");
const usPreset = fiscalYear.getFiscalYearWithPreset("us-federal", null, year);
const presetCSV = fiscalYear.exportToCSV(usPreset.months, {
    dateFormat: 'YYYY-MM-DD'
});
console.log(`US Federal Government fiscal year ${year} months (CSV):`);
console.log(presetCSV.split('\n').slice(0, 4).join('\n'));
console.log("...");

// To run this example: node examples/export.example.js
