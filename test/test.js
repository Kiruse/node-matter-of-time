"use strict";

const assert = require('assert');
const mot = require('..');

describe('Matter of Time', function() {
    it('Absolute dates', async function() {
        assert.equal(mot.november(20).valueOf(),        new Date(new Date().getFullYear(), 10, 20).valueOf());
        assert.equal(mot.january(4).in(2020).valueOf(), new Date(2020, 0, 4).valueOf());
        assert.equal(mot.may(1).in(2015).valueOf(),     new Date(2015, 4, 1).valueOf());
        
        // First weekday should always exist
        assert.ok(mot.first.sunday.of.june());
        
        // First weekday should be correct, obviously...
        assert.equal(mot.first.sunday.of.june(2018).valueOf(), new Date(2018, 5, 3).valueOf());
    })
    
    it('Relative dates', async function() {
        let date = mot.october(12).in(2018);
        
        assert.equal(date.current.monday().valueOf(),    new Date(2018, 9,  8).valueOf());
        assert.equal(date.last.friday().valueOf(),       new Date(2018, 9,  5).valueOf());
        assert.equal(date.next.wednesday().valueOf(),    new Date(2018, 9, 17).valueOf());
        assert.equal(date.upcoming.saturday().valueOf(), new Date(2018, 9, 13).valueOf());
        assert.equal(date.upcoming.tuesday().valueOf(),  new Date(2018, 9, 16).valueOf());
        
        date = mot.october(30).in(2018);
        assert.equal(date.upcoming.friday().valueOf(), new Date(2018, 10, 2).valueOf());
        
        date = mot.october(15).in(2018);
        assert.equal(date.tomorrow().valueOf(),  new Date(2018, 9, 16).valueOf());
        assert.equal(date.yesterday().valueOf(), new Date(2018, 9, 14).valueOf());
        assert.equal(date.next.week().valueOf(), new Date(2018, 9, 22).valueOf());
        assert.equal(date.last.week().valueOf(), new Date(2018, 9,  8).valueOf());
        
        assert.equal(mot.october(15).in(2018).next.month().valueOf(),  new Date(2018, 10, 15).valueOf());
        assert.equal(mot.october(31).in(2018).next.month().valueOf(),  new Date(2018, 10, 30).valueOf());
        assert.equal(mot.november(30).in(2018).last.month().valueOf(), new Date(2018,  9, 31).valueOf());
        assert.equal(mot.february(29).in(2016).next.year().valueOf(),  new Date(2017,  1, 28).valueOf());
        assert.equal(mot.february(28).in(2017).last.year().valueOf(),  new Date(2016,  1, 29).valueOf());
        
        assert.equal(mot.february(28).in(2018).next.month(1, true).valueOf(), new Date(2018, 2, 28).valueOf());
        assert.equal(mot.march(31).in(2018).last.month(1, true).valueOf(),    new Date(2018, 2,  3).valueOf());
    })
    
    it('Time Adjustment', async function() {
        assert.equal(mot.october(13).in(2018).at('12am').valueOf(),           new Date(2018, 9, 13).valueOf());
        assert.equal(mot.october(13).in(2018).at('4:45am').valueOf(),         new Date(2018, 9, 13, 4, 45).valueOf());
        assert.equal(mot.october(13).in(2018).at('4:45:32am').valueOf(),      new Date(2018, 9, 13, 4, 45, 32).valueOf());
        assert.equal(mot.october(13).in(2018).at('5:42:23.123 pm').valueOf(), new Date(2018, 9, 13, 17, 42, 23, 123).valueOf());
        assert.equal(mot.october(13).in(2018).at('17:42:23.123').valueOf(),   new Date(2018, 9, 13, 17, 42, 23, 123).valueOf());
    })
})
