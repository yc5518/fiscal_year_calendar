// Example of using fiscal-year-calendar to get week lists
const fiscalYear = require("../index");

// Example 1: Get week options for the current fiscal year with Monday as the start of the week (default)
console.log("Example 1: Current fiscal year with Monday as start of week");
const currentWeekOptions = fiscalYear.getWeekOptions();
console.log(`Total weeks: ${currentWeekOptions.length}`);
console.log("First week:", currentWeekOptions[0]);
console.log("Last week:", currentWeekOptions[currentWeekOptions.length - 1]);
console.log("\n");

// Example 2: Get week options for fiscal year 2020 with Sunday as the start of the week
console.log("Example 2: Fiscal year 2020 with Sunday as start of week");
const fy2020WeekOptionsSunday = fiscalYear.getWeekOptions(
    fiscalYear.START_OF_WEEK.sunday.value,
    2020,
);
console.log(`Total weeks: ${fy2020WeekOptionsSunday.length}`);
console.log("First week:", fy2020WeekOptionsSunday[0]);
console.log("Last week:", fy2020WeekOptionsSunday[fy2020WeekOptionsSunday.length - 1]);
console.log("\n");

// Example 3: Get week options for fiscal year 2018 with Saturday as the start of the week
console.log("Example 3: Fiscal year 2018 with Saturday as start of week");
const fy2018WeekOptionsSaturday = fiscalYear.getWeekOptions(
    fiscalYear.START_OF_WEEK.saturday.value,
    2018,
);
console.log(`Total weeks: ${fy2018WeekOptionsSaturday.length}`);
console.log("First week:", fy2018WeekOptionsSaturday[0]);
console.log("Last week:", fy2018WeekOptionsSaturday[fy2018WeekOptionsSaturday.length - 1]);
console.log("\n");

// Example 4: Using a specific timezone (New York)
console.log("Example 4: Using a specific timezone (New York)");
const timezone = "America/New_York";
const currentTimeInNY = fiscalYear.getTimezone(timezone);
console.log(`Current time in New York: ${currentTimeInNY.format("LLLL")}`);

const fy2022WeekOptionsWithTimezone = fiscalYear.getWeekOptions(
    fiscalYear.START_OF_WEEK.monday.value,
    2022,
    timezone,
);
console.log(`Total weeks: ${fy2022WeekOptionsWithTimezone.length}`);
console.log("First week:", fy2022WeekOptionsWithTimezone[0]);
console.log("Last week:", fy2022WeekOptionsWithTimezone[fy2022WeekOptionsWithTimezone.length - 1]);

// To run this example: node examples/getWeekList.example.js
