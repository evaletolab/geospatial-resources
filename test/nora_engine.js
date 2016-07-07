

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

    it("::current_asset should return an object with status invalid and asset null", function(done){
        var nora_engine = require('../lib/nora_engine')(),
            nora_status_factory = require('../lib/nora_status');


        var result = nora_engine.current_asset(),
            uninitialized_status = nora_status_factory.uninitialized_gps_position();

        result.status.should.eql(uninitialized_status);
        should.equal(result.asset, null);

        done();
    });

    it("::current_asset should return an asset in zone 1 if last gps position in zone 1", function(done){
        var nora_engine = require('../lib/nora_engine')(),
            nora_status_factory = require('../lib/nora_status');

        // zone_id 1
        nora_engine.update_position({coords:{longitude: 6.13511323928833, latitude: 46.19984317040266}});

        var result = nora_engine.current_asset(),
            ok_status = nora_status_factory.ok();

        result.status.should.eql(ok_status);

        done();
    });

    it("::current_asset should return the same asset as long as asset_complete message not received", function(done){
        var nora_engine = require('../lib/nora_engine')();

        // zone_id 1
        nora_engine.update_position({coords:{longitude: 6.13511323928833, latitude: 46.19984317040266}});

        var result = nora_engine.current_asset(),
            result_2 = nora_engine.current_asset();

        result.should.eql(result_2);

        done();
    });


    it("::signal_asset_complete should return error message, if gps position not previously set", function(done){
    
        var nora_engine = require('../lib/nora_engine')(),
            nora_status_factory = require('../lib/nora_status'),
            uninitialized_status = nora_status_factory.uninitialized_gps_position();

        var result = nora_engine.signal_asset_complete();

        result.status.should.eql(uninitialized_status);
        should.equal(result.asset, null);

        done();
    });

    it("::signal_asset_complete should return different asset", function(done){
        var nora_engine = require('../lib/nora_engine')();

        // zone_id 1
        nora_engine.update_position({coords:{longitude: 6.13511323928833, latitude: 46.19984317040266}});

        var result, result_2;

        result = nora_engine.current_asset();
        
        result_2 = nora_engine.signal_asset_complete();

        result.should.not.eql(result_2);

        done();
    });

    it("::current_asset should return same asset as last call to signal_asset_complete", function(done){
        var nora_engine = require('../lib/nora_engine')();

        // zone_id 1
        nora_engine.update_position({coords:{longitude: 6.13511323928833, latitude: 46.19984317040266}});

        var result, result_2;

        nora_engine.current_asset();
        
        result = nora_engine.signal_asset_complete();

        result_2 = nora_engine.current_asset();

        result.should.eql(result_2);

        done();
    });
});
