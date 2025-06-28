
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

## What's New in Version 1.1.0

This update adds several new features to the fiscal-year-calendar library:

1. **Custom Fiscal Year Start Date**: You can now specify any month and day as the start of your fiscal year.
2. **Quarter and Month Support**: Added functions to get quarter and month options for a fiscal year.
3. **Date Analysis Functions**: New functions to determine the fiscal year, quarter, month, and day number for any given date.
4. **Improved Documentation**: Comprehensive documentation and examples for all functions.

## Installation

```bash
npm install fiscal-year-calendar
```

## Usage

```javascript
const fiscalYear = require('fiscal-year-calendar');

// Get week options for fiscal year 2020 with Monday as start of week
const weekOptions = fiscalYear.getWeekOptions(
    fiscalYear.START_OF_WEEK.monday.value,
    null, // timezone (null for local timezone)
    2020, // year
);
console.log(`Total weeks: ${weekOptions.length}`);
console.log("First week:", weekOptions[0]);

// Get start and end dates of fiscal year 2020
const startDate = fiscalYear.getStartDate(null, 2020);
const endDate = fiscalYear.getEndDate(null, 2020);
console.log(`Start date: ${startDate.format("YYYY-MM-DD")}`);
console.log(`End date: ${endDate.format("YYYY-MM-DD")}`);

// Get fiscal year for a specific date
const date = "2019-10-15"; // October 15, 2019
console.log(`Fiscal year for ${date}: ${fiscalYear.getFiscalYear(date)}`);
```

For more examples, see the [examples directory](./examples).

## APIs

### Constants

- START_OF_WEEK

    Options for start of a week, with options for Monday, Saturday and Sunday.
    
    ```javascript
    fiscalYear.START_OF_WEEK.monday.value   // "monday"
    fiscalYear.START_OF_WEEK.sunday.value   // "sunday"
    fiscalYear.START_OF_WEEK.saturday.value // "saturday"
    ```

### Week Functions

- getWeekOptions(startOfWeek, timezone, year, fyStartMonth, fyStartDay)

    Returns week options for a fiscal year.
    
    Parameters:
    - startOfWeek: Option from START_OF_WEEK, defaults to Monday
    - timezone: Timezone string (from moment-timezone), defaults to local timezone
    - year: Fiscal year number, defaults to current year
    - fyStartMonth: Fiscal year start month (0-based, 0=January), defaults to 9 (October)
    - fyStartDay: Fiscal year start day, defaults to 1

    Returns an array of objects with the following properties:
    ```javascript
    {
      week: "1",
      startTime: "Mon Oct 1 2019 00:00:00 GMT+1300",
      endTime: "Sun Oct 7 2019 23:59:59 GMT+1300"
    }
    ```

### Quarter Functions

- getQuarterOptions(startOfWeek, timezone, year, fyStartMonth, fyStartDay)

    Returns quarter options for a fiscal year.
    
    Parameters: Same as getWeekOptions
    
    Returns an array of objects with the following properties:
    ```javascript
    {
      quarter: "1",
      startTime: "Mon Oct 1 2019 00:00:00 GMT+1300",
      endTime: "Tue Dec 31 2019 23:59:59 GMT+1300"
    }
    ```

### Month Functions

- getMonthOptions(startOfWeek, timezone, year, fyStartMonth, fyStartDay)

    Returns month options for a fiscal year.
    
    Parameters: Same as getWeekOptions
    
    Returns an array of objects with the following properties:
    ```javascript
    {
      month: "1",
      name: "October",
      startTime: "Mon Oct 1 2019 00:00:00 GMT+1300",
      endTime: "Thu Oct 31 2019 23:59:59 GMT+1300"
    }
    ```

### Date Functions

- getStartDate(timezone, year, startOfWeek, fyStartMonth, fyStartDay)

    Returns the start date of a fiscal year as a moment object.
    
    Parameters: Same as getWeekOptions

- getEndDate(timezone, year, startOfWeek, fyStartMonth, fyStartDay)

    Returns the end date of a fiscal year as a moment object.
    
    Parameters: Same as getWeekOptions

- getDateNumber(date, timezone, startOfWeek, fyStartMonth, fyStartDay)

    Given a date, returns the sequence number of the date within the fiscal year.
    
    Parameters:
    - date: Date string or moment object
    - Other parameters: Same as getWeekOptions
    
    Returns a number representing the day number within the fiscal year (1-based).

- getFiscalYear(date, timezone, fyStartMonth, fyStartDay)

    Given a date, returns the fiscal year number which may differ from calendar year.
    
    Parameters:
    - date: Date string or moment object
    - timezone: Timezone string (from moment-timezone), defaults to local timezone
    - fyStartMonth: Fiscal year start month (0-based, 0=January), defaults to 9 (October)
    - fyStartDay: Fiscal year start day, defaults to 1
    
    Returns a number representing the fiscal year.

- getFiscalQuarter(date, timezone, startOfWeek, fyStartMonth, fyStartDay)

    Given a date, returns the quarter number of the fiscal year (1-4).
    
    Parameters: Same as getDateNumber

- getFiscalMonth(date, timezone, startOfWeek, fyStartMonth, fyStartDay)

    Given a date, returns the month number of the fiscal year (1-12).
    
    Parameters: Same as getDateNumber

### Utility Functions

- getTimezone(timezone)

    An encapsulation of moment.tz() from Moment.js. Parameter timezone is exactly the same as the one from Moment.js.
    
    Returns a moment object for the specified timezone.

## Examples

See the [examples directory](./examples) for more examples of how to use this library.

## License

ISC
