////////////////////////////////////////////////////////////////////////////////
// Matter of Time Date extension microlibrary
// -----
// Copyright (c) Kiruse 2018
// License: GNU GPL 3.0
"use strict";

const longMonths = [0, 2, 4, 6, 7, 9, 11];

let MatterOfTime = module.exports = class extends Date {
    constructor(...args) {
        // Forward constructor arguments
        super(...args);
        
        /**
         * Interface to find the date of a specific weekday of this week.
         * @see MatterOfTime#upcoming
         * @see MatterOfTime#next
         * @see MatterOfTime#last
         */
        this.current = {
            monday   : () => calcWeekdayDate.call(this, 1),
            tuesday  : () => calcWeekdayDate.call(this, 2),
            wednesday: () => calcWeekdayDate.call(this, 3),
            thursday : () => calcWeekdayDate.call(this, 4),
            friday   : () => calcWeekdayDate.call(this, 5),
            saturday : () => calcWeekdayDate.call(this, 6),
            sunday   : () => calcWeekdayDate.call(this, 0),
        }

        /**
         * Interface to find the next instance of a weekday, starting the "tomorrow" with
         * respect to the date represented by this instance.
         * @see MatterOfTime#current
         * @see MatterOfTime#next
         * @see MatterOfTime#last
         */
        this.upcoming = {
            monday   : () => calcUpcomingWeekdayDate.call(this, 1),
            tuesday  : () => calcUpcomingWeekdayDate.call(this, 2),
            wednesday: () => calcUpcomingWeekdayDate.call(this, 3),
            thursday : () => calcUpcomingWeekdayDate.call(this, 4),
            friday   : () => calcUpcomingWeekdayDate.call(this, 5),
            saturday : () => calcUpcomingWeekdayDate.call(this, 6),
            sunday   : () => calcUpcomingWeekdayDate.call(this, 0),
        }

        /**
         * Interface to find a particular weekday of the next week.
         * @see MatterOfTime#current
         * @see MatterOfTime#upcoming
         * @see MatterOfTime#last
         */
        this.next = {
            monday   : () => calcNextWeekdayDate.call(this, 1),
            tuesday  : () => calcNextWeekdayDate.call(this, 2),
            wednesday: () => calcNextWeekdayDate.call(this, 3),
            thursday : () => calcNextWeekdayDate.call(this, 4),
            friday   : () => calcNextWeekdayDate.call(this, 5),
            saturday : () => calcNextWeekdayDate.call(this, 6),
            sunday   : () => calcNextWeekdayDate.call(this, 0),
            
            week: (repeat) => {
                if (typeof repeat !== 'number' || repeat < 1) repeat = 1;
                return MatterOfTime.weeks(repeat).from(this);
            },
            month: (repeat, vanilla) => {
                if (typeof repeat !== 'number' || repeat < 1) repeat = 1;
                return this.addMonths(repeat, vanilla);
            },
            year: (repeat, vanilla) => {
                if (typeof repeat !== 'number' || repeat < 1) repeat = 1;
                return this.addYears(repeat, vanilla);
            },
        }

        /**
         * Interface to find a particular weekday of the past week.
         * @see MatterOfTime#current
         * @see MatterOfTime#upcoming
         * @see MatterOfTime#next
         */
        this.last = {
            monday   : () => calcLastWeekdayDate.call(this, 1),
            tuesday  : () => calcLastWeekdayDate.call(this, 2),
            wednesday: () => calcLastWeekdayDate.call(this, 3),
            thursday : () => calcLastWeekdayDate.call(this, 4),
            friday   : () => calcLastWeekdayDate.call(this, 5),
            saturday : () => calcLastWeekdayDate.call(this, 6),
            sunday   : () => calcLastWeekdayDate.call(this, 0),
            
            week: (repeat) => {
                if (typeof repeat !== 'number' || repeat < 1) repeat = 1;
                return MatterOfTime.weeks(-repeat).from(this);
            },
            month: (repeat, vanilla) => {
                if (typeof repeat !== 'number' || repeat < 1) repeat = 1;
                return this.addMonths(-repeat, vanilla);
            },
            year: (repeat, vanilla) => {
                if (typeof repeat !== 'number' || repeat < 1) repeat = 1;
                return this.addYears(-repeat, vanilla);
            },
        }
    }
    
    /**
     * Adjusts this date's time to the representing string.
     * 
     * String is expected to be in the format of
     * 
     *     HH:MM:SS.XXX am|pm
     * 
     * Where HH may be any value from 0-24, MM and SS may be anything from 0-59,
     * and X may be any digit.
     * 
     * am|pm may be set if HH <= 12.
     * 
     * Any portion of the time format may be omitted, including the separating
     * characters when appropriate. XXX may be up to three digits.
     * @param {string} time A formatted string representing the time to adjust to.
     * @chainable
     */
    at(time) {
        let matches = time.match(/^\s*([0-2]?\d)(:([0-5]\d)(:([0-5]\d)(.(\d{1,3}))?)?)?(\s*(am|pm))?$/);
        if (!matches) throw Error('Invalid input format, expected HH[:MM[:SS[.MS]]] [am|pm]');
        
        const hours   = parseInt(matches[1]),
              minutes = parseInt(matches[3]),
              seconds = parseInt(matches[5]),
              millis  = parseInt(matches[7]),
              ampm    = matches[9];
        
        if (isNaN(hours)) throw Error('Need at least hours to set');
        this.setHours(hours);
        
        if (!isNaN(minutes)) {
            this.setMinutes(minutes);
        }
        if (!isNaN(seconds)) {
            this.setSeconds(seconds);
        }
        if (!isNaN(millis)) {
            this.setMilliseconds(millis);
        }
        
        if (ampm) {
            if (hours > 12) throw Error('Unexpted am/pm specifier in 24h format');
            if (this.getHours() === 12) {
                this.setHours(0); // 12am == 00:00 in 24hr format
            }
            if (ampm.toLowerCase() === 'pm') this.setHours(this.getHours() + 12);
        }
        
        return this;
    }
    
    /**
     * Adds this date to the other date and returns the result. Useful for
     * computing timely offsets, e.g. "3 hours from now"
     * 
     * Example:
     * 
     *      const Mot = require('matter-of-time');
     *      Mot.hours(3).from(Mot.now());
     * 
     * @param {Number|Date|MatterOfTime} other
     * @returns {MatterOfTime}
     */
    from(other) {
        return new MatterOfTime(other.valueOf() + this.valueOf());
    }
    
    /**
     * Gets a new MatterOfTime instance representing tomorrow with respect to
     * this date.
     * 
     * Yields the same result as `MatterOfTime.days(1).from(this)`.
     * @returns {MatterOfTime}
     */
    tomorrow() {
        return MatterOfTime.days(1).from(this);
    }
    
    /**
     * Gets a new MatterOfTime instance representing yesterday with respect to
     * this date.
     * 
     * * Yields the same result as `MatterOfTime.days(-1).from(this)`.
     * @returns {MatterOfTime}
     */
    yesterday() {
        return MatterOfTime.days(-1).from(this);
    }
    
    addYears(count, vanilla) {
        if (typeof count !== 'number') throw Error('Expected number of years to add');
        vanilla = !!vanilla;
        
        let copy = new MatterOfTime(this);
        
        // Extended behavior merely accounts for leap years
        if (!vanilla && copy.getMonth() === 1 && copy.isLastOfMonth()) {
            copy.setDate(1);
            copy.setFullYear(copy.getFullYear() + count);
            copy.setDate(MatterOfTime.getLastDateOfMonth(1, copy.getFullYear()));
        }
        
        else {
            copy.setFullYear(copy.getFullYear() + count);
        }
        
        return copy;
    }
    
    addMonths(repeat, vanilla) {
        if (typeof repeat !== 'number') throw Error('Expected number of months to add');
        vanilla = !!vanilla;
        
        let copy = new MatterOfTime(this);
        
        // Our extended behavior automatically adjusts jumping from the
        // last day of a month to the last day of the next.
        if (!vanilla && copy.isLastOfMonth()) {
            const relativeMonth = this.getMonth() + repeat;
            const targetMonth = relativeMonth % 12;
            const targetYear  = copy.getFullYear() + Math.floor(relativeMonth / 12);
            
            copy.setDate(1);
            copy.setFullYear(targetYear);
            copy.setMonth(targetMonth);
            copy.setDate(MatterOfTime.getLastDateOfMonth(targetMonth, targetYear));
        }
        
        // Vanilla behavior just adds to or subtracts from the month portion of the date, which may yield
        // undesirable results, such as jumping from Oct. 31st to Oct. 1st
        else {
            copy.setMonth(copy.getMonth() + repeat);
        }
        
        return copy;
    }
    
    /**
     * Adjusts this date to the specified year.
     * @param {Number} year to set to.
     * @chainable
     */
    in(year) {
        return this.addYears(year - this.getFullYear());
    }
    
    /**
     * Tests if the represented date is the last in its month.
     * @returns {Boolean}
     */
    isLastOfMonth() {
        return MatterOfTime.isLastOfMonth(this.getFullYear(), this.getMonth(), this.getDate());
    }
    
    /**
     * Tests if the given date is the last of the month in the given year.
     * @param {Number} year 
     * @param {Number} month 
     * @param {Number} date 
     * @returns {Boolean}
     */
    static isLastOfMonth(year, month, date) {
        if (month === 1) {
            if (year % 4 === 0) return date === 29
            return date === 28;
        }
        else if (longMonths.indexOf(month) !== -1) {
            return date === 31;
        }
        else {
            return date === 30;
        }
    }
    
    /**
     * Convenience method to create a new MatterOfTime instance from Date.now(),
     * for consistency in usage.
     * @returns {MatterOfTime}
     */
    static now() { return new MatterOfTime(Date.now()); }
    
    /**
     * Shorthand method for `MatterOfTime.now().tomorrow()` for consistency.
     * @returns {MatterOfTime}
     */
    static tomorrow() { return MatterOfTime.now().tomorrow(); }
    
    /**
     * Shorthand method for `MatterOfTime.now().yesterday()` for consistency.
     * @returns {MatterOfTime}
     */
    static yesterday() { return MatterOfTime.now().yesterday(); }
    
    /**
     * Calculates the last date in the target month of the target year.
     * @param {Number} targetMonth 
     * @param {Number} targetYear 
     * @return {Number}
     */
    static getLastDateOfMonth(targetMonth, targetYear) {
        // Target month is February - easy case
        if (targetMonth === 1) {
            // Consider leap years
            if (targetYear % 4 === 0) return 29;
            else return 28;
        }
        
        // Target month has 31 days - easiest case
        else if (longMonths.indexOf(targetMonth) !== -1) {
            return 31;
        }
        
        // Target month has 30 days
        else {
            return 30;
        }
    }
    
    ////////////////////////////////////////////////////////////////////////////
    // Static helper functions to create Date objects representing semantic
    // time spans.
    
    /**
     * Returns a Date object representing a timespan of `value` milliseconds.
     * @param {Number} value 
     * @return {Date}
     */
    static milliseconds(value) {
        return new MatterOfTime(value);
    }
    
    /**
     * Returns a Date object representing a timespan of `value` seconds.
     * @param {Number} value 
     * @return {Date}
     */
    static seconds(value) {
        return new MatterOfTime(value * 1000);
    }
    
    /**
     * Returns a Date object representing a timespan of `value` minutes.
     * @param {Number} value 
     * @return {Date}
     */
    static minutes(value) {
        return new MatterOfTime(value * 60000);
    }
    
    /**
     * Returns a Date object representing a timespan of `value` hours.
     * @param {Number} value 
     * @return {Date}
     */
    static hours(value) {
        return new MatterOfTime(value * 3600000);
    }
    
    /**
     * Returns a Date object representing a timespan of `value` days.
     * @param {Number} value 
     * @return {Date}
     */
    static days(value) {
        return new MatterOfTime(value * 86400000);
    }
    
    /**
     * Returns a Date object representing a timespan of `value` weeks at 7
     * days a week.
     * @param {Number} value 
     * @return {Date}
     */
    static weeks(value) {
        return MatterOfTime.days(7 * value);
    }
    
    /**
     * Same as `MatterOfTime.weeks(2 * value)`.
     * @param {Number} value 
     * @return {Date}
     */
    static fortnites(value) {
        return MatterOfTime.weeks(2 * value);
    }
    
    /**
     * Returns a Date object representing a timespan of `value` months at 30
     * days a month. For a semantically more human solution, see the `next`
     * property.
     * @param {Number} value 
     * @return {Date}
     */
    static months(value) {
        return MatterOfTime.days(30 * value);
    }
    
    /**
     * Same as `MatterOfTime.months(4 * value)`.
     * @param {Number} value 
     * @return {Date}
     */
    static trimester(value) {
        return MatterOfTime.months(4 * value);
    }
    
    /**
     * Same as `MatterOfTime.months(6 * value)`.
     * @param {Number} value 
     * @return {Date}
     */
    static semester(value) {
        return MatterOfTime.months(6 * value);
    }
    
    /**
     * Returns a Date object representing a timespan of `value` years at 365
     * days a year. For a semantically more human solution, see the `next`
     * property.
     * @param {Number} value 
     * @return {Date}
     */
    static years(value) {
        return MatterOfTime.days(365 * value);
    }
    
    /**
     * Same as `MatterOfTime.years(10 * value)`.
     * @param {Number} value 
     * @return {Date}
     */
    static decades(value) {
        return MatterOfTime.years(10 * value);
    }
    
    /**
     * Same as `MatterOfTime.years(100 * value)`.
     * @param {Number} value 
     * @return {Date}
     */
    static centuries(value) {
        return MatterOfTime.years(100 * value);
    }
    
    /**
     * Same as `MatterOfTime.years(1000 * value)`.
     * @param {Number} value 
     * @return {Date}
     */
    static millenia(value) {
        return MatterOfTime.years(1000 * value);
    }
}


////////////////////////////////////////////////////////////////////////////////
// Semantically more human approach to finding a certain date or day.

// Helper function to calculate this week's <day>.
function calcWeekdayDate(day) {
    let date = new MatterOfTime(this.valueOf());
    date.setDate(date.getDate() + day - date.getDay());
    return date;
}

// Helper function to calculate next week's <day>.
function calcNextWeekdayDate(day) {
    let date = new MatterOfTime(this);
    date.setDate(date.getDate() + 7 + day - date.getDay());
    return date;
}

// Helper function to calculate last week's <day>.
function calcLastWeekdayDate(day) {
    let date = new MatterOfTime(this);
    date.setDate(date.getDate() - 7 + day - date.getDay());
    return date;
}

// Helper function to get the next upcoming instance of <day>, either this week
// or next week, excluding today.
function calcUpcomingWeekdayDate(day) {
    if (this.getDay() >= day) return calcNextWeekdayDate.call(this, day);
    return calcWeekdayDate.call(this, day);
}

/**
 * Computes the Date representing the first of month `value` (range 1 to 12) in
 * the year `year` at midnight.
 * @see MatterOfTime#in
 * @param {Number} index Index of the month, from 1 to 12 where 1 = January and 12 = December.
 * @param {Number} date? Optional date to set. Defaults to the 1st of the month.
 * @returns {MatterOfTime}
 */
MatterOfTime.month = function(index, date) {
    if (index < 1 || index > 12);
    const tmp = new Date(), year = tmp.getFullYear(), month = index - 1;
    return new MatterOfTime(year, month, Math.min(MatterOfTime.getLastDateOfMonth(month, date), date));
}

/**
 * Calculates the Date representing 1st Jan of this year at midnight.
 * @param {Number} year? Optional year to set. Defaults to this year.
 * @returns {MatterOfTime}
 */
MatterOfTime.january = MatterOfTime.month.bind(MatterOfTime, 1);

/**
 * Calculates the Date representing 1st Feb of this year at midnight.
 * @param {Number} year? Optional year to set. Defaults to this year.
 * @returns {MatterOfTime}
 */
MatterOfTime.february = MatterOfTime.month.bind(MatterOfTime, 2);

/**
 * Calculates the Date representing 1st Mar of this year at midnight.
 * @param {Number} year? Optional year to set. Defaults to this year.
 * @returns {MatterOfTime}
 */
MatterOfTime.march = MatterOfTime.month.bind(MatterOfTime, 3);

/**
 * Calculates the Date representing 1st Apr of this year at midnight.
 * @param {Number} year? Optional year to set. Defaults to this year.
 * @returns {MatterOfTime}
 */
MatterOfTime.april = MatterOfTime.month.bind(MatterOfTime, 4);

/**
 * Calculates the Date representing 1st May of this year at midnight.
 * @param {Number} year? Optional year to set. Defaults to this year.
 * @returns {MatterOfTime}
 */
MatterOfTime.may = MatterOfTime.month.bind(MatterOfTime, 5);

/**
 * Calculates the Date representing 1st Jun of this year at midnight.
 * @param {Number} year? Optional year to set. Defaults to this year.
 * @returns {MatterOfTime}
 */
MatterOfTime.june = MatterOfTime.month.bind(MatterOfTime, 6);

/**
 * Calculates the Date representing 1st Jul of this year at midnight.
 * @param {Number} year? Optional year to set. Defaults to this year.
 * @returns {MatterOfTime}
 */
MatterOfTime.july = MatterOfTime.month.bind(MatterOfTime, 7);

/**
 * Calculates the Date representing 1st Aug of this year at midnight.
 * @param {Number} year? Optional year to set. Defaults to this year.
 * @returns {MatterOfTime}
 */
MatterOfTime.august = MatterOfTime.month.bind(MatterOfTime, 8);

/**
 * Calculates the Date representing 1st Sep of this year at midnight.
 * @param {Number} year? Optional year to set. Defaults to this year.
 * @returns {MatterOfTime}
 */
MatterOfTime.september = MatterOfTime.month.bind(MatterOfTime, 9);

/**
 * Calculates the Date representing 1st Oct of this year at midnight.
 * @param {Number} year? Optional year to set. Defaults to this year.
 * @returns {MatterOfTime}
 */
MatterOfTime.october = MatterOfTime.month.bind(MatterOfTime, 10);

/**
 * Calculates the Date representing 1st Nov of this year at midnight.
 * @param {Number} year? Optional year to set. Defaults to this year.
 * @returns {MatterOfTime}
 */
MatterOfTime.november = MatterOfTime.month.bind(MatterOfTime, 11);

/**
 * Calculates the Date representing 1st Dec of this year at midnight.
 * @param {Number} year? Optional year to set. Defaults to this year.
 * @returns {MatterOfTime}
 */
MatterOfTime.december = MatterOfTime.month.bind(MatterOfTime, 12);


/**
 * Gets the nth instance of `day` in `month` of the `year`. Unlike the vanilla
 * Date API, if the `nth` does not exist, does not roll over into the next month
 * but returns undefined.
 * @returns {MatterOfTime|undefined} An extended Date object representing the requested date, or undefined if none found.
 */
MatterOfTime.nthWeekdayOfMonth = function(day, nth, month, year) {
    if (day < 0 || day > 6) throw RangeError(`Day ${day} out of range, expected 0 to 6.`);
    if (nth <= 0) throw RangeError(`Cannot determine 0th (or less) weekday of a month!`);
    if (nth > 5) throw RangeError(`The 5th weekday of a month may be rare already, but the ${nth}th? Seriously?`);
    
    // Compute the 1st of the respective month
    const tpl = new Date();
    const mot = new MatterOfTime(tpl.getFullYear(), tpl.getMonth(), tpl.getDate());
    mot.setDate(1);
    
    if (month !== undefined) {
        if (month < 0 || month > 11) throw RangeError(`Month ${month} out of range, expected 0 to 11.`);
        mot.setMonth(month);
    }
    
    if (year) mot.setFullYear(year);
    
    // Iterate forwards through the days until we find the nth instance of the specified day.
    for (let i = 0; i < nth; ++i) {
        do {
            mot.setDate(mot.getDate() + 1);
        } while (mot.getDay() !== day);
    }
    
    if (mot.getMonth() !== month) return undefined;
    return mot;
}

/**
 * Gets the last instance of `day` in `month` of the `year`.
 * @returns {MatterOfTime} An extended Date object representing the requested date.
 */
MatterOfTime.lastWeekdayOfMonth = function(day, month, year) {
    if (day < 0 || day > 6) throw RangeError(`Day ${day} out of range, expected 0 to 6.`);
    
    // Compute the 1st of the following month
    const mot = new MatterOfTime();
    mot.setDate(1);
    
    if (month !== undefined) {
        if (month < 0 || month > 11) throw RangeError(`Month ${month} out of range, expected 0 to 11.`);
        mot.setMonth(month);
    }
    mot.setMonth(mot.getMonth() + 1);
    
    if (year) mot.setFullYear(year);
    
    // Iterate backwards through the days until we find the first instance of the specified day
    do {
        mot.setDate(mot.getDate() - 1);
    } while (mot.getDay() !== day);
    return mot;
}

// Assigns the named months to the `obj` as methods simply forwarding the calls
// to the callback.
function assignMonthsCallbacks(obj, callback) {
    Object.assign(obj, {
        january  (...args) {return callback.call(this,  0, ...args)},
        february (...args) {return callback.call(this,  1, ...args)},
        march    (...args) {return callback.call(this,  2, ...args)},
        april    (...args) {return callback.call(this,  3, ...args)},
        may      (...args) {return callback.call(this,  4, ...args)},
        june     (...args) {return callback.call(this,  5, ...args)},
        july     (...args) {return callback.call(this,  6, ...args)},
        august   (...args) {return callback.call(this,  7, ...args)},
        september(...args) {return callback.call(this,  8, ...args)},
        october  (...args) {return callback.call(this,  9, ...args)},
        november (...args) {return callback.call(this, 10, ...args)},
        december (...args) {return callback.call(this, 11, ...args)},
    });
    return obj;
}

// Create MatterOfTime.(first|second|third|fourth|fifth).<day>.of.<month>
['first', 'second', 'third', 'fourth', 'fifth']
.forEach((spec, nth) => {
    let currSpec = MatterOfTime[spec] = MatterOfTime[spec] || {};
    
    ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    .forEach((day, dayIndex) => {
        currSpec[day] = currSpec[day] || {}
        currSpec[day].of = currSpec[day].of || {};
        
        assignMonthsCallbacks(currSpec[day].of, MatterOfTime.nthWeekdayOfMonth.bind(null, dayIndex, nth + 1));
    });
})

// Namespace for MatterOfTime.last.<day>.of.<month>
MatterOfTime.last = {};

// Create MatterOfTime.last.<day>.of.<month>
['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
.forEach((day, index) => {
    MatterOfTime.last[day] = MatterOfTime.last[day] || {};
    MatterOfTime.last[day].of = MatterOfTime.last[day].of || {};
    assignMonthsCallbacks(MatterOfTime.last[day].of, MatterOfTime.lastWeekdayOfMonth.bind(null, index));
})
assignMonthsCallbacks(MatterOfTime.last.sunday.of, MatterOfTime.lastWeekdayOfMonth.bind(null, 0));
