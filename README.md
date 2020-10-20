# fiscal_year_calendar

The initiative of creating this package is to provide a way to customize a calendar to fit requirements.

The parameters it allows to customize are:

* Start day of a week. E.g.: Set start day of a week to be Sunday/Monday

* Start date of a year. E.g.: Set a date which will be always included in the first week a year. You may want the week including October 1st to be first week of a year. So the first day of the week will be first day of your customized year.

Based on the above customized parameters, it outputs:

* Whole customized year (could be tax year, fiscal year etc.)

* Date range of each week for a fiscal year, which can be used as query parameters

* Start/end date of a fiscal year

## Usage



## APIs

### Existings

* START_OF_WEEK
    Options for start of a week, now only have options for Monday, Saturday and Sunday

* getWeekOptions(startOfWeek, timezone, year)
    startOfWeek is a option from START_OF_WEEK, which will be default to be Monday.

* getTimezone(timezone)
    It's just an encapsulation of moment.tz() from Moment.js for not necessarily importinm Moment.js. Parameter timezone is exactly the same to the one from Moment.js.

### To be added

* getQuarterOptions
    Returns quarter options of the fiscal year

* getMonthOptions
    Returns month options of the fiscal year

* getStartDate
    Returns start date of the fiscal year

* getEndDate
    Returns end date of the fiscal year

* getDateNumber
    Given a date, returns sequence number of the date in the fiscal year

* getFiscalYear
    Given a date, returns fiscal year number which may differ from calendar year

* getFiscalQuarter
    Given a date, returns quarter number of the fiscal year

* getFiscalMonth
    Given a date, returns month number of the fiscal year
