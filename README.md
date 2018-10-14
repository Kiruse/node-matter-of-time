# node-matter-of-time
A Date extension library to make it what it should've always been.

*Matter of Time* is semantically and syntactically more human than the standard's
`Date` "class". It is a functional approach with a structure similar to other
literal string parsing libraries out there, without the string parsing aspect!

String parsing is nice and all, but strings cannot be processed by linters and
are often exempt from refactorization. If the API changes, strings that once
were valid suddenly break without notice or reason as to why.

# API Facets

See [the unit tests](test/test.js) for more use cases!

## Absolute Dates

    MatterOfTime.<month>([date]).in(<year>)
    
    // e.g.
    MatterOfTime.january(2).in(1980)
    MatterOfTime.february(29).in(2000)
    MatterOfTime.november(20).in(2018)
    
A call to `.in()` is optional and works on any date object, not just in this
context. By default, dates are created with respect to this year.

## first, second, third, fourth, fifth, and last weekday getters

Following this format:

    MatterOfTime.<first|second|third|fourth|fifth|last>.<weekday>.of.<month>()

Examples:

    MatterOfTime.first.monday.of.january()
    MatterOfTime.last.sunday.of.december()
    
    // .fifth may not always return a value, to aid in testing if a fifth instance
    // of a weekday even exists!
    let date = MatterOfTime.fifth.wednesday.of.july()
    if (date) // ... do stuff!

## Convenience Functions

The following three related functions create new `MatterOfTime` instances and
should be self-explanatory:

    MatterOfTime.now()
    MatterOfTime.tomorrow()
    MatterOfTime.yesterday()

`.now()` directly corresponds to `Date.now()`, except it returns a `MatterOfTime`
instance. `.tomorrow()` and `.yesterday()` are implemented as
`MatterOfTime.now().tomorrow()` and `MatterOfTime.now().yesterday()` respectively.

## Timespans

*Matter of Time* offers a variety of durational functions to create Date objects
representing a timespan of a certain resolution.

    MatterOfTime.milliseconds(1234)
    MatterOfTime.seconds(33)
    MatterOfTime.days(5)

The various available resolutions are:

 - milliseconds
 - seconds
 - minutes
 - hours
 - days
 - weeks
 - fortnites
 - months
 - trimester
 - semester
 - years
 - decades
 - centuries
 - millenia

### .from(MatterOfTime.now())

Specifically designed for timespans, the `.from(<date>)` method adds this
represented timespan to the specified date.

    MatterOfTime.days(3).from(MatterOfTime.now())
    MatterOfTime.days(-3).from(MatterOfTime.first.monday.of.january())

## Relative Dates

### last, current, upcoming, next weekday getters

Following this format:

    MatterOfTime.now().<last|current|upcoming|next>.<weekday>()

All of these interfaces work on different scopes of weeks, which should be
self-explanatory:

`last` operates on the last week.

`current` operates on this week.

`next` operates on the next week.

`upcoming` is a bit different in that it combines `current` with `next`. When the
queried weekday already lies in the past with respect to this date, it retrieves
the weekday of the next week instead.

Examples:

    MatterOfTime.now().next.monday()
    MatterOfTime.now().last.friday()
    MatterOfTime.now().upcoming.tuesday()
    MatterOfTime.now().current.sunday()

### <last|next>.<week|month|year>([count=1])

Both the `next` and `last` interfaces expose the `week`, `month` and `year`
functions which all take an optional argument to get this date in `count` cycles.

Examples:

    MatterOfTime.now().next.week()
    MatterOfTime.now().next.month(2)
    MatterOfTime.now().next.year(4)

### Time Adjustment

There's a single method available to adjust the time through a formatted string.

The format is:

    HH:MM:SS.XXX [am|pm]

`am|pm` is illegal when HH > 12 and will throw an error to aid in clarity. If
omitted, `am` is assumed.

`HH` is any number from 0-24, single digit numbers allowed.

`MM` and `SS` is any number from 00-59, with double digit numbers required.

`X` may be any digit. Up to 3 digits may be provided.

Except for `HH`, none of the time components are required. When omitted their
respective separator must be omitted as well, otherwise throwing an exception.

Examples:

    MatterOfTime.now().at('5pm')
    
    // Midnight
    MatterOfTime.now().at('0')
    MatterOfTime.now().at('00:00')
    MatterOfTime.now().at('12am')
    
    // Midday
    MatterOfTime.now().at('12')
    MatterOfTime.now().at('12:00')
    MatterOfTime.now().at('12pm')
    
    MatterOfTime.now().at('17')
    MatterOfTime.now().at('17:24')
    MatterOfTime.now().at('17:24:33')
    MatterOfTime.now().at('17:24:33.123')
