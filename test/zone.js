/**
 * unit tests for configuration module
 * Licensed under MIT license (see LICENSE)
 */

var config = require('../lib/config');
var assert = require('assert');
var should = require('should');
var test = exports;






describe("zone, assert coherence of data set 'zones.json'", function(){

// a simple test file to assert coherence of data set 'zones.json'

  var fs = require('fs'),
      _ = require('lodash'),
      turf = require('turf');


  var zones = JSON.parse(fs.readFileSync('data/zones.json', 'utf-8')),
      zone_1 = _.find(zones.features, {zone_id : '1'}),
      zone_2 = _.find(zones.features, {zone_id : '2'}),
      zone_3 = _.find(zones.features, {zone_id : '3'}),
      zone_4 = _.find(zones.features, {zone_id : '4'});


  before(function(done){
    done()
  });

  //
  // [long,lat]!! long, lat order when defining points in GeoJson

  it("pt1 should be in zone 1", function(done){
    var pt1 = turf.point([2.357530296, 48.850952711]);
    turf.inside(pt1, zone_1).should.be.true();
    done()
  });

  it("pt1 should NOT be in zone 2", function(done){
    var pt1 = turf.point([2.357530296, 48.850952711]);
    turf.inside(pt1, zone_2).should.not.be.true();
    done()
  });


  it("pt2 should be in zone 2", function(done){
    // pt2 should be in zone 2
    var pt2 = turf.point([2.355159223, 48.851736342]);
    turf.inside(pt2, zone_2).should.be.true();
    done()
  });

  it("pt3 should be in zone 3", function(done){
    // pt3 should be in zone 3
    var pt3 = turf.point([2.355845869, 48.852421126]);
    turf.inside(pt3, zone_3).should.be.true();
    done()
  });

  it("pt4 should be in zone 4", function(done){
    // pt4 should be in zone 4
    var pt4 = turf.point([2.358109653, 48.851637506]);
    turf.inside(pt4, zone_4).should.be.true();
    done()
  });

  it("generate random points inside zone 4", function(done) {
    var pt4a= turf.pointOnSurface(zone_4);
    turf.inside(pt4a, zone_4).should.be.true();
    done()
  })


});
