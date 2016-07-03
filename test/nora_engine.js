

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

    it("::current_zone should return null if update_position never previously called with valid data", function(done){
        var nora_engine = require('../lib/nora_engine')(),
            turf = require('turf');

        var current_zone_id = nora_engine.current_zone_id();
    
        should.equal(current_zone_id, null);

        done();
    });
});
