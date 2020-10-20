const demo = require("../index");

describe("Test getWeekOptions", () => {
    test("FY2020 to have 52 weeks", () => {
        const options = demo.getWeekOptions(null, 2020);
        expect(options).toHaveLength(52);
    });

    test("FY2018 to have 53 weeks", () => {
        const options = demo.getWeekOptions(null, 2018);
        expect(options).toHaveLength(53);
    });
});