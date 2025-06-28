// Examples of using fiscal-year-calendar library
const fiscalYear = require("../index");

console.log("=== Fiscal Year Calendar Examples ===\n");

// Example 1: Get week options for fiscal year 2020 with Monday as start of week
console.log("Example 1: Week options for fiscal year 2020 (Monday start)");
const weekOptions = fiscalYear.getWeekOptions(
    fiscalYear.START_OF_WEEK.monday.value,
    null,
    2020,
);
console.log(`Total weeks: ${weekOptions.length}`);
console.log("First week:", weekOptions[0]);
console.log("Last week:", weekOptions[weekOptions.length - 1]);
console.log("\n");

// Example 2: Get quarter options for fiscal year 2020
console.log("Example 2: Quarter options for fiscal year 2020");
const quarterOptions = fiscalYear.getQuarterOptions(
    fiscalYear.START_OF_WEEK.monday.value,
    null,
    2020,
);
console.log(`Total quarters: ${quarterOptions.length}`);
console.log("Quarters:", quarterOptions);
console.log("\n");

// Example 3: Get month options for fiscal year 2020
console.log("Example 3: Month options for fiscal year 2020");
const monthOptions = fiscalYear.getMonthOptions(
    fiscalYear.START_OF_WEEK.monday.value,
    null,
    2020,
);
console.log(`Total months: ${monthOptions.length}`);
console.log("First month:", monthOptions[0]);
console.log("Last month:", monthOptions[monthOptions.length - 1]);
console.log("\n");

// Example 4: Get start and end dates of fiscal year 2020
console.log("Example 4: Start and end dates of fiscal year 2020");
const startDate = fiscalYear.getStartDate(null, 2020);
const endDate = fiscalYear.getEndDate(null, 2020);
console.log(`Start date: ${startDate.format("YYYY-MM-DD")}`);
console.log(`End date: ${endDate.format("YYYY-MM-DD")}`);
console.log("\n");

// Example 5: Get fiscal year for a specific date
console.log("Example 5: Get fiscal year for specific dates");
const date1 = "2019-10-15"; // October 15, 2019
const date2 = "2020-09-15"; // September 15, 2020
console.log(`Fiscal year for ${date1}: ${fiscalYear.getFiscalYear(date1)}`);
console.log(`Fiscal year for ${date2}: ${fiscalYear.getFiscalYear(date2)}`);
console.log("\n");

// Example 6: Get fiscal quarter for a specific date
console.log("Example 6: Get fiscal quarter for specific dates");
console.log(`Fiscal quarter for ${date1}: ${fiscalYear.getFiscalQuarter(date1)}`);
console.log(`Fiscal quarter for ${date2}: ${fiscalYear.getFiscalQuarter(date2)}`);
console.log("\n");

// Example 7: Get fiscal month for a specific date
console.log("Example 7: Get fiscal month for specific dates");
console.log(`Fiscal month for ${date1}: ${fiscalYear.getFiscalMonth(date1)}`);
console.log(`Fiscal month for ${date2}: ${fiscalYear.getFiscalMonth(date2)}`);
console.log("\n");

// Example 8: Get date number within fiscal year
console.log("Example 8: Get date number within fiscal year");
const firstDayOfFY = "2019-10-01"; // October 1, 2019
const lastDayOfFY = "2020-09-30"; // September 30, 2020
console.log(`Date number for ${firstDayOfFY}: ${fiscalYear.getDateNumber(firstDayOfFY)}`);
console.log(`Date number for ${lastDayOfFY}: ${fiscalYear.getDateNumber(lastDayOfFY)}`);
console.log("\n");

// Example 9: Using a custom fiscal year start date (January 1st)
console.log("Example 9: Using a custom fiscal year start date (January 1st)");
const customFYStartMonth = 0; // January (0-based)
const customFYStartDay = 1; // 1st day of the month

const customStartDate = fiscalYear.getStartDate(
    null,
    2020,
    fiscalYear.START_OF_WEEK.monday.value,
    customFYStartMonth,
    customFYStartDay,
);
const customEndDate = fiscalYear.getEndDate(
    null,
    2020,
    fiscalYear.START_OF_WEEK.monday.value,
    customFYStartMonth,
    customFYStartDay,
);

console.log(`Custom FY 2020 start date: ${customStartDate.format("YYYY-MM-DD")}`);
console.log(`Custom FY 2020 end date: ${customEndDate.format("YYYY-MM-DD")}`);

// To run this example: node examples/fiscalYearExamples.js
