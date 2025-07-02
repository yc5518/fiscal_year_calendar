"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addHoliday = addHoliday;
exports.addHolidaySet = addHolidaySet;
exports.getHolidays = getHolidays;
exports.isHoliday = isHoliday;
exports.getBusinessDaysInPeriod = getBusinessDaysInPeriod;
/**
 * Holiday handling functionality
 */
const moment_1 = __importDefault(require("moment"));
// Store holidays in memory
const holidays = [];
/**
 * Adds a holiday to the holiday registry
 * @param {string|Date} date - The date of the holiday
 * @param {string} name - The name of the holiday
 * @param {boolean} recurring - Whether the holiday recurs annually
 * @returns {Holiday} The added holiday
 */
function addHoliday(date, name, recurring = false) {
    const holiday = {
        date,
        name,
        recurring
    };
    holidays.push(holiday);
    return holiday;
}
/**
 * Adds a set of common holidays for a specific country
 * @param {CountryCode} countryCode - The country code
 * @returns {Holiday[]} The added holidays
 */
function addHolidaySet(countryCode) {
    const currentYear = new Date().getFullYear();
    const addedHolidays = [];
    switch (countryCode) {
        case "US":
            // New Year's Day
            addedHolidays.push(addHoliday(`${currentYear}-01-01`, "New Year's Day", true));
            // Martin Luther King Jr. Day (third Monday in January)
            const mlkDay = (0, moment_1.default)().year(currentYear).month(0).date(1);
            while (mlkDay.day() !== 1) {
                mlkDay.add(1, "day");
            }
            mlkDay.add(14, "days"); // Third Monday
            addedHolidays.push(addHoliday(mlkDay.format("YYYY-MM-DD"), "Martin Luther King Jr. Day", true));
            // Presidents' Day (third Monday in February)
            const presidentsDay = (0, moment_1.default)().year(currentYear).month(1).date(1);
            while (presidentsDay.day() !== 1) {
                presidentsDay.add(1, "day");
            }
            presidentsDay.add(14, "days"); // Third Monday
            addedHolidays.push(addHoliday(presidentsDay.format("YYYY-MM-DD"), "Presidents' Day", true));
            // Memorial Day (last Monday in May)
            const memorialDay = (0, moment_1.default)().year(currentYear).month(4).endOf("month");
            while (memorialDay.day() !== 1) {
                memorialDay.subtract(1, "day");
            }
            addedHolidays.push(addHoliday(memorialDay.format("YYYY-MM-DD"), "Memorial Day", true));
            // Independence Day
            addedHolidays.push(addHoliday(`${currentYear}-07-04`, "Independence Day", true));
            // Labor Day (first Monday in September)
            const laborDay = (0, moment_1.default)().year(currentYear).month(8).date(1);
            while (laborDay.day() !== 1) {
                laborDay.add(1, "day");
            }
            addedHolidays.push(addHoliday(laborDay.format("YYYY-MM-DD"), "Labor Day", true));
            // Columbus Day (second Monday in October)
            const columbusDay = (0, moment_1.default)().year(currentYear).month(9).date(1);
            while (columbusDay.day() !== 1) {
                columbusDay.add(1, "day");
            }
            columbusDay.add(7, "days"); // Second Monday
            addedHolidays.push(addHoliday(columbusDay.format("YYYY-MM-DD"), "Columbus Day", true));
            // Veterans Day
            addedHolidays.push(addHoliday(`${currentYear}-11-11`, "Veterans Day", true));
            // Thanksgiving Day (fourth Thursday in November)
            const thanksgivingDay = (0, moment_1.default)().year(currentYear).month(10).date(1);
            while (thanksgivingDay.day() !== 4) {
                thanksgivingDay.add(1, "day");
            }
            thanksgivingDay.add(21, "days"); // Fourth Thursday
            addedHolidays.push(addHoliday(thanksgivingDay.format("YYYY-MM-DD"), "Thanksgiving Day", true));
            // Christmas Day
            addedHolidays.push(addHoliday(`${currentYear}-12-25`, "Christmas Day", true));
            break;
        case "UK":
            // New Year's Day
            addedHolidays.push(addHoliday(`${currentYear}-01-01`, "New Year's Day", true));
            // Good Friday (calculated for current year)
            // This is a simplified calculation and may not be accurate for all years
            const easterSunday = calculateEasterSunday(currentYear);
            const goodFriday = easterSunday.clone().subtract(2, "days");
            addedHolidays.push(addHoliday(goodFriday.format("YYYY-MM-DD"), "Good Friday", true));
            // Easter Monday
            const easterMonday = easterSunday.clone().add(1, "day");
            addedHolidays.push(addHoliday(easterMonday.format("YYYY-MM-DD"), "Easter Monday", true));
            // Early May Bank Holiday (first Monday in May)
            const earlyMayBankHoliday = (0, moment_1.default)().year(currentYear).month(4).date(1);
            while (earlyMayBankHoliday.day() !== 1) {
                earlyMayBankHoliday.add(1, "day");
            }
            addedHolidays.push(addHoliday(earlyMayBankHoliday.format("YYYY-MM-DD"), "Early May Bank Holiday", true));
            // Spring Bank Holiday (last Monday in May)
            const springBankHoliday = (0, moment_1.default)().year(currentYear).month(4).endOf("month");
            while (springBankHoliday.day() !== 1) {
                springBankHoliday.subtract(1, "day");
            }
            addedHolidays.push(addHoliday(springBankHoliday.format("YYYY-MM-DD"), "Spring Bank Holiday", true));
            // Summer Bank Holiday (last Monday in August)
            const summerBankHoliday = (0, moment_1.default)().year(currentYear).month(7).endOf("month");
            while (summerBankHoliday.day() !== 1) {
                summerBankHoliday.subtract(1, "day");
            }
            addedHolidays.push(addHoliday(summerBankHoliday.format("YYYY-MM-DD"), "Summer Bank Holiday", true));
            // Christmas Day
            addedHolidays.push(addHoliday(`${currentYear}-12-25`, "Christmas Day", true));
            // Boxing Day
            addedHolidays.push(addHoliday(`${currentYear}-12-26`, "Boxing Day", true));
            break;
        // Add more countries as needed
        default:
            break;
    }
    return addedHolidays;
}
/**
 * Helper function to calculate Easter Sunday for a given year
 * @param {number} year - The year
 * @returns {moment.Moment} Easter Sunday date
 */
function calculateEasterSunday(year) {
    // This is a simplified algorithm for calculating Easter Sunday
    // Known as the "Butcher's Algorithm"
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-based month
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return (0, moment_1.default)().year(year).month(month).date(day);
}
/**
 * Gets all registered holidays
 * @returns {Holiday[]} The registered holidays
 */
function getHolidays() {
    return [...holidays];
}
/**
 * Checks if a date is a holiday
 * @param {string|Date|moment.Moment} date - The date to check
 * @returns {boolean} Whether the date is a holiday
 */
function isHoliday(date) {
    const checkDate = moment_1.default.isMoment(date) ? date.clone() : (0, moment_1.default)(date);
    return holidays.some(holiday => {
        const holidayDate = (0, moment_1.default)(holiday.date);
        if (holiday.recurring) {
            // For recurring holidays, only compare month and day
            return holidayDate.month() === checkDate.month() &&
                holidayDate.date() === checkDate.date();
        }
        else {
            // For non-recurring holidays, compare full date
            return holidayDate.isSame(checkDate, "day");
        }
    });
}
/**
 * Gets the number of business days in a period, optionally excluding holidays
 * @param {string|Date|moment.Moment} startDate - The start date
 * @param {string|Date|moment.Moment} endDate - The end date
 * @param {boolean} excludeHolidays - Whether to exclude holidays
 * @returns {number} The number of business days
 */
function getBusinessDaysInPeriod(startDate, endDate, excludeHolidays = true) {
    const start = moment_1.default.isMoment(startDate) ? startDate.clone() : (0, moment_1.default)(startDate);
    const end = moment_1.default.isMoment(endDate) ? endDate.clone() : (0, moment_1.default)(endDate);
    let businessDays = 0;
    const current = start.clone();
    while (current.isSameOrBefore(end, "day")) {
        // Check if it's a weekday (Monday to Friday)
        if (current.day() !== 0 && current.day() !== 6) {
            // Check if it's not a holiday (if we're excluding holidays)
            if (!excludeHolidays || !isHoliday(current)) {
                businessDays++;
            }
        }
        current.add(1, "day");
    }
    return businessDays;
}
