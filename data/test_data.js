// a simple test file to assert coherence of data set 'zones.json'

var fs = require('fs'),
    assert = require('assert'),
    _ = require('lodash'),
    turf = require('turf');


var zones = JSON.parse(fs.readFileSync('zones.json', 'utf-8')),
    zone_1 = _.find(zones.features, {id : '1'}),
    zone_2 = _.find(zones.features, {id : '2'}),
    zone_3 = _.find(zones.features, {id : '3'}),
    zone_4 = _.find(zones.features, {id : '4'});

// long lat !! order when defining points in GeoJson

// pt1 should be in zone 1
var pt1 = turf.point([2.357530296, 48.850952711]);
assert(turf.inside(pt1, zone_1));

// pt2 should be in zone 2
var pt2 = turf.point([2.355159223, 48.851736342]);
assert(turf.inside(pt2, zone_2));

// pt3 should be in zone 3
var pt3 = turf.point([2.355845869, 48.852421126]);
assert(turf.inside(pt3, zone_3));

// pt4 should be in zone 4
var pt4 = turf.point([2.358109653, 48.851637506]);
assert(turf.inside(pt4, zone_4));

// we get here alive then all is ok…

console.log("all assertions passed");
