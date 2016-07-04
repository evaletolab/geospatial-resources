

var config = require('../lib/config'),
    assert = require('assert'),
    should = require('should'),
    test = exports;

describe("test nora_engine", function(){


    var fs = require('fs'),
        _ = require('lodash'),
        util = require('util');

    before(function(done){
       done(); 
    });

    it("::current_zone_id should return null if update_position never previously called with valid data", function(done){
        var nora_engine = require('../lib/nora_engine')(),
            turf = require('turf');

        var current_zone_id = nora_engine.current_zone_id();
    
        should.equal(current_zone_id, null);

        done();
    });

    it("::current_zone_id should return zone_id 1 if update_position previously called with point in zone 1", function(done){
        var nora_engine = require('../lib/nora_engine')(),
            turf = require('turf');

        nora_engine.update_position({coords:{longitude: 6.13511323928833, latitude: 46.19984317040266}});

        var current_zone_id = nora_engine.current_zone_id();
    
        current_zone_id.should.equal('zone_1');

        done();
    });

    it("::assets_for_current_zone should return all the assets for a zone", function(done){
        var nora_engine = require('../lib/nora_engine')(),
            zones = require('../lib/model_data')['zones'],
            expected_asset_count = _.find(zones, {'id': 'zone_1'}).assets.length;
            turf = require('turf');

        // zone_id 1
        nora_engine.update_position({coords:{longitude: 6.13511323928833, latitude: 46.19984317040266}});

        var zones = nora_engine.assets_for_current_zone();
    
        zones.length.should.equal(expected_asset_count);

        done();
    });

    it("::assets_for_current_zone should return an empty array if update_position has never been called", function(done){
        var nora_engine = require('../lib/nora_engine')(),
            turf = require('turf');

        var zones = nora_engine.assets_for_current_zone();
    
        zones.length.should.equal(0);

        done();
    });
});
