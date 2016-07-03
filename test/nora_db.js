

var config = require('../lib/config'),
    assert = require('assert'),
    should = require('should'),
    nora_db = require('../lib/nora_db').nora_db,
    test = exports;

describe("test nora db", function(){


    var fs = require('fs'),
        _ = require('lodash'),
        turf = require('turf'),
        util = require('util');

    before(function(done){
       done(); 
    });

    it("::zone_for_point should return a feature with prop zone_id = zone_2 given a point in zone_2", function(done){
        var geo = require('../lib/zone_geo_data'),
            turf = require('turf');

        var zone_2 = _.find(geo.features, { properties: { zone_id: 'zone_2' }}),
            pt_inside_atelier = turf.point([6.13483965396881, 46.19957769341309]);


        var result = nora_db.zone_for_point(pt_inside_atelier);

        result.should.eql(zone_2);

        done();
    });

    it("::zone_for_point should return feature point with zone_id 'other'", function(done){
        var geo = require('../lib/zone_geo_data'),
            turf = require('turf');

        var pt_on_the_english_channel = turf.point([ -0.9558105468749999, 50.05008477838258]);


        var result = nora_db.zone_for_point(pt_on_the_english_channel);

        result.properties.zone_id.should.equal('other'); 

        done();
    });

    it("::all_assets_for_zone_id should return all assets for zone id", function(done){
        var model_data = { "assets": [
            {
                "id": "foo",
                "zone": ["other"]
            },
            {
                "id": "bar",
            },
            {
                "id": "foobar",
                "zone" : ["zone_1"]
            }]};

        var nora_db = require("../lib/nora_db").nora_db_factory(model_data, null, require('lodash'));

        var result = nora_db.all_assets_for_zone_id('other');
    
        result.length.should.equal(1);

        _.includes(result, {"id": "foo" }).should.be.true;

        done();
    
    });

    it("::all_assets_for_zone should return all assets for zone", function(done){
        var model_data = { "assets": [
            {
                "id": "foo",
                "zone": ["other"]
            },
            {
                "id": "bar",
            },
            {
                "id": "foobar",
                "zone" : ["zone_1"]
            }]};

        var zone = {
            "properties": { zone_id: "other" }
        };

        var nora_db = require("../lib/nora_db").nora_db_factory(model_data, null, require('lodash'));


        var result = nora_db.all_assets_for_zone(zone);
    
        result.length.should.equal(1);

        _.includes(result, {"id": "foo" }).should.be.true;

        done();
    
    });


});
