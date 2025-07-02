# fiscal_year_calendar
  
The initiative of creating this package is to dynamically customize a fiscal year or financial year calendar based on different dates as the first day of a fiscal year.
E.g: Some organizations would have the first Monday of October to be the start date of a financial year.
  
The parameters it allows to customize are:

* Start day of a week. E.g.: Set start day of a week to be Sunday/Monday/Saturday

* Start date of a year. E.g.: Set a date which will be always included in the first week of a year. You may want the week including October 1st to be the first week of a year. So the first day of the week will be the first day of your customized year.

* Fiscal year start month and day. E.g.: Set October 1st as the start of your fiscal year.

Based on the above customized parameters, it outputs:

* Whole customized year (could be tax year, fiscal year etc.)

* Date range of each week, month, and quarter for a fiscal year, which can be used as query parameters

* Start/end date of a fiscal year

* Fiscal year, quarter, month, and day number for any given date

## What's New in Version 2.0.0

This major update brings significant enhancements to the fiscal-year-calendar library:

1. **TypeScript Support**: The entire library has been rewritten in TypeScript, providing better type safety and developer experience.

2. **Special Calendar Systems**: Added support for retail calendar systems (4-4-5, 4-5-4, 5-4-4) as well as bi-weekly and semi-monthly periods.

3. **Holiday Management**: New functions to add, track, and manage holidays, including built-in holiday sets for various countries.

4. **Date Range Analysis**: Enhanced date range utilities for fiscal year-to-date, quarter-to-date, and month-to-date calculations.

5. **Period Comparisons**: New functions for comparing fiscal periods and calculating year-over-year changes.

6. **Fiscal Year Presets**: Built-in presets for common fiscal year configurations (US Federal, UK, Australia, etc.).

7. **Improved Documentation**: Comprehensive documentation and examples for all functions.

## Installation

```bash
npm install fiscal-year-calendar
```

## Usage

### TypeScript

```typescript
import {
  getFiscalYear,
  getStartDate,
  getEndDate,
  getWeekOptions,
  START_OF_WEEK,
  FISCAL_YEAR_PRESETS
} from 'fiscal-year-calendar';

// Get week options for fiscal year 2025 with Monday as start of week
const weekOptions = getWeekOptions(
    START_OF_WEEK.monday.value,
    null, // timezone (null for local timezone)
    2025, // year
    9,    // fiscal year start month (0-based, 9 = October)
    1     // fiscal year start day
);
console.log(`Total weeks: ${weekOptions.length}`);
console.log("First week:", weekOptions[0]);

// Get start and end dates of fiscal year 2025
const startDate = getStartDate(null, 2025);
const endDate = getEndDate(null, 2025);
console.log(`Start date: ${startDate.format("YYYY-MM-DD")}`);
console.log(`End date: ${endDate.format("YYYY-MM-DD")}`);

// Get fiscal year for a specific date
const date = "2024-10-15"; // October 15, 2024
console.log(`Fiscal year for ${date}: ${getFiscalYear(date)}`);
```

### JavaScript

```javascript
const {
  getFiscalYear,
  getStartDate,
  getEndDate,
  getWeekOptions,
  START_OF_WEEK,
  FISCAL_YEAR_PRESETS
} = require('fiscal-year-calendar');

// Get week options for fiscal year 2025 with Monday as start of week
const weekOptions = getWeekOptions(
    START_OF_WEEK.monday.value,
    null, // timezone (null for local timezone)
    2025, // year
    9,    // fiscal year start month (0-based, 9 = October)
    1     // fiscal year start day
);
console.log(`Total weeks: ${weekOptions.length}`);
console.log("First week:", weekOptions[0]);
```

For more examples, see the [examples directory](./examples).

## APIs

### Constants

- **START_OF_WEEK**

    Options for start of a week, with options for Monday, Saturday and Sunday.
    
    ```typescript
    START_OF_WEEK.monday.value   // "monday"
    START_OF_WEEK.sunday.value   // "sunday"
    START_OF_WEEK.saturday.value // "saturday"
    ```

- **CALENDAR_SYSTEMS**

    Options for different calendar systems.
    
    ```typescript
    CALENDAR_SYSTEMS.STANDARD    // "standard"
    CALENDAR_SYSTEMS.RETAIL_445  // "4-4-5"
    CALENDAR_SYSTEMS.RETAIL_454  // "4-5-4"
    CALENDAR_SYSTEMS.RETAIL_544  // "5-4-4"
    ```

- **FISCAL_YEAR_PRESETS**

    Predefined fiscal year configurations for various countries and standards.
    
    ```typescript
    FISCAL_YEAR_PRESETS["us-federal"]    // US Federal Government (Oct 1 - Sep 30)
    FISCAL_YEAR_PRESETS["uk-standard"]   // UK Standard (Apr 6 - Apr 5)
    FISCAL_YEAR_PRESETS["australia"]     // Australia (Jul 1 - Jun 30)
    FISCAL_YEAR_PRESETS["new-zealand"]   // New Zealand (Apr 1 - Mar 31)
    FISCAL_YEAR_PRESETS["singapore"]     // Singapore (Apr 1 - Mar 31)
    FISCAL_YEAR_PRESETS["calendar-year"] // Calendar Year (Jan 1 - Dec 31)
    // And more...
    ```

### Core Calendar Functions

- **getWeekOptions(startOfWeek, timezone, year, fyStartMonth, fyStartDay)**

    Returns week options for a fiscal year.
    
    Parameters:
    - startOfWeek: Option from START_OF_WEEK, defaults to Monday
    - timezone: Timezone string (from moment-timezone), defaults to local timezone
    - year: Fiscal year number, defaults to current year
    - fyStartMonth: Fiscal year start month (0-based, 0=January), defaults to 9 (October)
    - fyStartDay: Fiscal year start day, defaults to 1

    Returns an array of objects with the following properties:
    ```typescript
    {
      week: "1",
      startTime: "Mon Oct 1 2024 00:00:00 GMT+1300",
      endTime: "Sun Oct 7 2024 23:59:59 GMT+1300"
    }
    ```

- **getQuarterOptions(startOfWeek, timezone, year, fyStartMonth, fyStartDay)**

    Returns quarter options for a fiscal year.
    
    Parameters: Same as getWeekOptions
    
    Returns an array of objects with the following properties:
    ```typescript
    {
      quarter: "1",
      startTime: "Mon Oct 1 2024 00:00:00 GMT+1300",
      endTime: "Tue Dec 31 2024 23:59:59 GMT+1300"
    }
    ```

- **getMonthOptions(startOfWeek, timezone, year, fyStartMonth, fyStartDay)**

    Returns month options for a fiscal year.
    
    Parameters: Same as getWeekOptions
    
    Returns an array of objects with the following properties:
    ```typescript
    {
      month: "1",
      name: "October",
      startTime: "Mon Oct 1 2024 00:00:00 GMT+1300",
      endTime: "Thu Oct 31 2024 23:59:59 GMT+1300"
    }
    ```

### Special Calendar Systems

- **getRetailCalendarOptions(startOfWeek, timezone, year, calendarSystem, fyStartMonth, fyStartDay)**

    Returns period options for a retail calendar system (4-4-5, 4-5-4, or 5-4-4).
    
    Parameters:
    - calendarSystem: One of CALENDAR_SYSTEMS values
    - Other parameters: Same as getWeekOptions
    
    Returns an array of objects with the following properties:
    ```typescript
    {
      period: "1",
      startTime: "Mon Oct 1 2024 00:00:00 GMT+1300",
      endTime: "Sun Oct 28 2024 23:59:59 GMT+1300",
      weeks: 4
    }
    ```

- **getBiWeeklyOptions(startOfWeek, timezone, year, fyStartMonth, fyStartDay)**

    Returns bi-weekly period options for a fiscal year.
    
    Parameters: Same as getWeekOptions
    
    Returns an array of objects with the following properties:
    ```typescript
    {
      period: "1",
      startTime: "Mon Oct 1 2024 00:00:00 GMT+1300",
      endTime: "Sun Oct 14 2024 23:59:59 GMT+1300"
    }
    ```

- **getSemiMonthlyOptions(timezone, year, fyStartMonth, fyStartDay)**

    Returns semi-monthly period options for a fiscal year (1st-15th and 16th-end of each month).
    
    Parameters: Same as getWeekOptions (except startOfWeek is not used)
    
    Returns an array of objects with the following properties:
    ```typescript
    {
      period: "1",
      startTime: "Mon Oct 1 2024 00:00:00 GMT+1300",
      endTime: "Mon Oct 15 2024 23:59:59 GMT+1300"
    }
    ```

### Date Functions

- **getStartDate(timezone, year, startOfWeek, fyStartMonth, fyStartDay)**

    Returns the start date of a fiscal year as a moment object.
    
    Parameters: Same as getWeekOptions

- **getEndDate(timezone, year, startOfWeek, fyStartMonth, fyStartDay)**

    Returns the end date of a fiscal year as a moment object.
    
    Parameters: Same as getWeekOptions

- **getDateNumber(date, timezone, startOfWeek, fyStartMonth, fyStartDay)**

    Given a date, returns the sequence number of the date within the fiscal year.
    
    Parameters:
    - date: Date string or moment object
    - Other parameters: Same as getWeekOptions
    
    Returns a number representing the day number within the fiscal year (1-based).

- **getFiscalYear(date, timezone, fyStartMonth, fyStartDay)**

    Given a date, returns the fiscal year number which may differ from calendar year.
    
    Parameters:
    - date: Date string or moment object
    - timezone: Timezone string (from moment-timezone), defaults to local timezone
    - fyStartMonth: Fiscal year start month (0-based, 0=January), defaults to 9 (October)
    - fyStartDay: Fiscal year start day, defaults to 1
    
    Returns a number representing the fiscal year.

- **getFiscalQuarter(date, timezone, startOfWeek, fyStartMonth, fyStartDay)**

    Given a date, returns the quarter number of the fiscal year (1-4).
    
    Parameters: Same as getDateNumber

- **getFiscalMonth(date, timezone, startOfWeek, fyStartMonth, fyStartDay)**

    Given a date, returns the month number of the fiscal year (1-12).
    
    Parameters: Same as getDateNumber

### Holiday Management

- **addHoliday(date, name, recurring)**

    Adds a holiday to the holiday registry.
    
    Parameters:
    - date: Date string or Date object
    - name: Name of the holiday
    - recurring: Whether the holiday recurs annually (defaults to false)
    
    Returns the added holiday object.

- **addHolidaySet(countryCode)**

    Adds a set of common holidays for a specific country.
    
    Parameters:
    - countryCode: Country code (e.g., "US", "UK", "CA", etc.)
    
    Returns an array of added holiday objects.

- **getHolidays()**

    Gets all registered holidays.
    
    Returns an array of holiday objects.

- **isHoliday(date)**

    Checks if a date is a holiday.
    
    Parameters:
    - date: Date string, Date object, or moment object
    
    Returns a boolean indicating whether the date is a holiday.

- **getBusinessDaysInPeriod(startDate, endDate, excludeHolidays)**

    Gets the number of business days in a period, optionally excluding holidays.
    
    Parameters:
    - startDate: Start date string, Date object, or moment object
    - endDate: End date string, Date object, or moment object
    - excludeHolidays: Whether to exclude holidays (defaults to true)
    
    Returns the number of business days.

### Date Range Utilities

- **getFiscalYearToDate(date, timezone, fyStartMonth, fyStartDay)**

    Gets the fiscal year-to-date range for a given date.
    
    Parameters:
    - date: Date string or moment object
    - Other parameters: Same as getFiscalYear
    
    Returns an object with startDate and endDate properties (both moment objects).

- **getFiscalQuarterToDate(date, timezone, startOfWeek, fyStartMonth, fyStartDay)**

    Gets the fiscal quarter-to-date range for a given date.
    
    Parameters: Same as getDateNumber
    
    Returns an object with startDate and endDate properties (both moment objects).

- **getFiscalMonthToDate(date, timezone, startOfWeek, fyStartMonth, fyStartDay)**

    Gets the fiscal month-to-date range for a given date.
    
    Parameters: Same as getDateNumber
    
    Returns an object with startDate and endDate properties (both moment objects).

- **getDateRangeInfo(startDate, endDate, timezone, startOfWeek, fyStartMonth, fyStartDay)**

    Gets information about a date range within the fiscal calendar.
    
    Parameters:
    - startDate: Start date string or moment object
    - endDate: End date string or moment object
    - Other parameters: Same as getWeekOptions
    
    Returns an object with detailed information about the date range.

### Period Comparisons

- **getSamePeriodLastYear(date, periodType, timezone, startOfWeek, fyStartMonth, fyStartDay)**

    Gets the same period from the previous fiscal year.
    
    Parameters:
    - date: Date string or moment object
    - periodType: Type of period ("day", "week", "month", "quarter", "year", "biweekly", "semimonthly")
    - Other parameters: Same as getWeekOptions
    
    Returns an object with currentPeriod and previousPeriod properties (both moment objects).

- **compareFiscalPeriods(period1, period2)**

    Compares two fiscal periods.
    
    Parameters:
    - period1: Object with startDate and endDate properties (both moment objects)
    - period2: Object with startDate and endDate properties (both moment objects)
    
    Returns an object with comparison information.

- **getYearOverYearChange(currentValue, previousValue, currentPeriod, previousPeriod)**

    Calculates the year-over-year change between two values.
    
    Parameters:
    - currentValue: Current value (number)
    - previousValue: Previous value (number)
    - currentPeriod: Description of current period (optional)
    - previousPeriod: Description of previous period (optional)
    
    Returns an object with change information.

### Preset Functions

- **getFiscalYearWithPreset(presetKey, timezone, year, startOfWeek)**

    Gets fiscal year information using a preset.
    
    Parameters:
    - presetKey: Key from FISCAL_YEAR_PRESETS
    - Other parameters: Same as getWeekOptions
    
    Returns an object with fiscal year information.

### Utility Functions

- **getTimezone(timezone)**

    An encapsulation of moment.tz() from Moment.js. Parameter timezone is exactly the same as the one from Moment.js.
    
    Returns a moment object for the specified timezone.

## Examples

See the [examples directory](./examples) for more examples of how to use this library.

## License

ISC
