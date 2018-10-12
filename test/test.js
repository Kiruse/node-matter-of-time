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
    })
})
