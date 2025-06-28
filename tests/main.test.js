const demo = require("../index");

describe("Test getWeekOptions", () => {
    test("FY2020 to have 52 weeks", () => {
        const options = demo.getWeekOptions(demo.START_OF_WEEK.monday.value, null, 2020);
        expect(options).toHaveLength(52);
    });

    test("FY2018 to have 53 weeks", () => {
        const options = demo.getWeekOptions(demo.START_OF_WEEK.monday.value, null, 2018);
        expect(options).toHaveLength(53);
    });

    test("Week options should have correct structure", () => {
        const options = demo.getWeekOptions(demo.START_OF_WEEK.monday.value, null, 2020);
        expect(options[0]).toHaveProperty("week");
        expect(options[0]).toHaveProperty("startTime");
        expect(options[0]).toHaveProperty("endTime");
    });
});

describe("Test getQuarterOptions", () => {
    test("Fiscal year should have 4 quarters", () => {
        const options = demo.getQuarterOptions(demo.START_OF_WEEK.monday.value, null, 2020);
        expect(options).toHaveLength(4);
    });

    test("Quarter options should have correct structure", () => {
        const options = demo.getQuarterOptions(demo.START_OF_WEEK.monday.value, null, 2020);
        expect(options[0]).toHaveProperty("quarter");
        expect(options[0]).toHaveProperty("startTime");
        expect(options[0]).toHaveProperty("endTime");
    });
});

describe("Test getMonthOptions", () => {
    test("Fiscal year should have 12 months", () => {
        const options = demo.getMonthOptions(demo.START_OF_WEEK.monday.value, null, 2020);
        expect(options).toHaveLength(12);
    });

    test("Month options should have correct structure", () => {
        const options = demo.getMonthOptions(demo.START_OF_WEEK.monday.value, null, 2020);
        expect(options[0]).toHaveProperty("month");
        expect(options[0]).toHaveProperty("name");
        expect(options[0]).toHaveProperty("startTime");
        expect(options[0]).toHaveProperty("endTime");
    });
});

describe("Test getStartDate and getEndDate", () => {
    test("Fiscal year 2020 should have correct start and end dates", () => {
        const startDate = demo.getStartDate(null, 2020);
        const endDate = demo.getEndDate(null, 2020);
        
        // Start date should be in 2019 (since fiscal year 2020 starts in 2019)
        expect(startDate.year()).toBe(2019);
        expect(startDate.month()).toBe(8); // September (0-based)
        
        // End date should be in 2020
        expect(endDate.year()).toBe(2020);
        expect(endDate.month()).toBe(8); // September (0-based)
        
        // End date should be later than start date
        expect(endDate.isAfter(startDate)).toBe(true);
    });
});

describe("Test getFiscalYear", () => {
    test("Date in October 2019 should be in fiscal year 2020", () => {
        const date = "2019-10-15"; // October 15, 2019
        const fiscalYear = demo.getFiscalYear(date);
        expect(fiscalYear).toBe(2020);
    });

    test("Date in September 2020 should be in fiscal year 2020", () => {
        const date = "2020-09-15"; // September 15, 2020
        const fiscalYear = demo.getFiscalYear(date);
        expect(fiscalYear).toBe(2020);
    });
});

describe("Test getFiscalQuarter", () => {
    test("First quarter of fiscal year should be correct", () => {
        const date = "2019-10-15"; // October 15, 2019
        const fiscalQuarter = demo.getFiscalQuarter(date);
        expect(fiscalQuarter).toBe(1);
    });

    test("Last quarter of fiscal year should be correct", () => {
        const date = "2020-09-15"; // September 15, 2020
        const fiscalQuarter = demo.getFiscalQuarter(date);
        expect(fiscalQuarter).toBe(4);
    });
});

describe("Test getFiscalMonth", () => {
    test("First month of fiscal year should be correct", () => {
        const date = "2019-10-15"; // October 15, 2019
        const fiscalMonth = demo.getFiscalMonth(date);
        expect(fiscalMonth).toBe(1);
    });

    test("Last month of fiscal year should be correct", () => {
        const date = "2020-09-15"; // September 15, 2020
        const fiscalMonth = demo.getFiscalMonth(date);
        expect(fiscalMonth).toBe(12);
    });
});

describe("Test getDateNumber", () => {
    test("First day of fiscal year should be day 1", () => {
        const date = "2019-10-01"; // October 1, 2019
        const dateNumber = demo.getDateNumber(date);
        expect(dateNumber).toBe(1);
    });
});
