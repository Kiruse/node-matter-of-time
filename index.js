////////////////////////////////////////////////////////////////////////////////
// Matter of Time Date extension microlibrary
// -----
// Copyright (c) Kiruse 2018
// License: GNU GPL 3.0
"use strict";

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
        }
    }
    
    /**
     * Adjusts this date to the specified year.
     * @param {Number} year to set to.
     * @chainable
     */
    in(year) {
        this.setFullYear(year);
        return this;
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
 * @param {Number} year? Optional year to set. Defaults to this year.
 * @returns {MatterOfTime}
 */
MatterOfTime.month = function(index, day) {
    if (index < 1 || index > 12);
    return new MatterOfTime(new MatterOfTime().getFullYear(), index - 1, day);
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
