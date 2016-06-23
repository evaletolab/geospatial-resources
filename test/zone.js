/**
 * unit tests for configuration module
 * Licensed under MIT license (see LICENSE)
 */

var config = require('../lib/config');
var assert = require('assert');
var should = require('should');
var test = exports;


describe("zone, assert coherence of data set 'zones.json'", function(){

  var fs = require('fs'),
      _ = require('lodash'),
      turf = require('turf');


  before(function(done){
    done();
  });

  var zones = JSON.parse(fs.readFileSync('data/zones.json', 'utf-8')),
      zone_1 = _.find(zones.features, {zone_id : '1'}),
      zone_2 = _.find(zones.features, {zone_id : '2'}),
      zone_3 = _.find(zones.features, {zone_id : '3'}),
      zone_4 = _.find(zones.features, {zone_id : '4'});


  var pt_on_bourbon_wharf = turf.point([2.355741262435913, 48.85275733753064]),
      pt_on_orleans_wharf = turf.point([2.3545074462890625, 48.85152896334864]),
      pt_on_bethune_wharf = turf.point([2.357436418533325, 48.85059177829556]),
      pt_on_anjou_wharf = turf.point([2.3585522174835205, 48.85189606683644]);

  it("pt_on_bourbon_wharf should be in zone 1 (quai Bourbon)", function(done){
    turf.inside(pt_on_bourbon_wharf, zone_1).should.be.true();
    done();
  });

  it("pt_on_bourbon_wharf should NOT be in zone 2 (quai Orléans) ", function(done){
    turf.inside(pt_on_bourbon_wharf, zone_2).should.not.be.true();
    done();
  });


  it("pt_on_orlean_wharf should be in zone 2 (quai Orléans)", function(done){
    turf.inside(pt_on_orleans_wharf, zone_2).should.be.true();
    done();
  });

  it("pt_on_bethune_wharf should be in zone 3 (quai Béthune)", function(done){
    turf.inside(pt_on_bethune_wharf, zone_3).should.be.true();
    done();
  });

  it("pt_on_anjou_wharf should be in zone 4 (quai Anjou)", function(done){
    turf.inside(pt_on_anjou_wharf, zone_4).should.be.true();
    done();
  });

  // is this useful, it seems this only tests turf.js not our data?
  it("generate random points inside zone 4", function(done) {
    var random_pt_on_zone_4 = turf.pointOnSurface(zone_4);
    turf.inside(random_pt_on_zone_4, zone_4).should.be.true();
    done();
  });
});
