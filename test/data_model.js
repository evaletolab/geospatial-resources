
var config = require('../lib/config'),
    assert = require('assert'),
    should = require('should'),
    spawn = require('child_process').spawn,
    test = exports;

describe("functional test of the model build procedure (dev environment)", function(){

    // should run in less than 45 seconds
    this.timeout(45 * 1000);

    var fs = require('fs'),
        _ = require('lodash'),
        turf = require('turf');

    before(function(done){
        
        // 1 set node env variable to development
        process.env['NODE_ENV'] = 'development';

        
        // 2 run gulp build
        var build_cmd = spawn('gulp', ['build_data_model']);

        build_cmd.on('close', function(exit_code){
            if(exit_code !== 0){
                console.log("failed to run gulp build script");
                process.exit(1);
            }
            done();
        });
    });


    it("document 'dans le miroir' should belong to zone 1", function(done){
        var model_data = require('../lib/model_data');

        var asset = _.find(model_data.assets, { title: "Dans le miroir" });
        
        _.includes(asset.zone, 'zone_1').should.be.true();
        done();
    });

    it("document 'dans le miroir' should have a speed of 6", function(done){
        var model_data = require('../lib/model_data');

        var asset = _.find(model_data.assets, { title: "Dans le miroir" });
        
        asset.speed.should.equal(6);
        done();
    });

    it("document 'dans le miroir' should have a narrative position of 'Développement'", function(done){
        var model_data = require('../lib/model_data');

        var asset = _.find(model_data.assets, { title: "Dans le miroir" }),
            narr_position_id = _.head(asset.narrative_position),
            narr_description = _.find(model_data.narrative_positions, { id: narr_position_id }).name;
        
        narr_description.should.equal('Développement');
        done();
    });

    it("zone_2 should include our atelier", function(done){
        var geo = require('../lib/zone_geo_data'),
            turf = require('turf');

        var zone_2 = _.find(geo.features, { properties: { zone_id: 'zone_2' }}),
            pt_inside_atelier = turf.point([6.13483965396881, 46.19957769341309]);

        turf.inside(pt_inside_atelier, zone_2).should.be.true();
        done();
    });

    it("should contain 4 zones with proper names", function(done){
        var geo = require('../lib/zone_geo_data');

        geo.features.length.should.equal(4);

        var ids = _.map(geo.features, 'properties.zone_id');
        _.intersection(ids, ['zone_1', 'zone_2', 'zone_3', 'zone_4']).length.should.equal(4);

        done();
    });
});

describe("functional test of the model build procedure (prod environment)", function(){

    // should run in less than 45 seconds
    this.timeout(45 * 1000);

    var fs = require('fs'),
        _ = require('lodash'),
        turf = require('turf');

    before(function(done){
        
        // 1 set node env variable to development
        process.env['NODE_ENV'] = 'production';

        // 2 clear require cache
        delete require.cache[require.resolve('../lib/zone_geo_data')];

        // 3 run gulp build
        var build_cmd = spawn('gulp', ['build_data_model']);

        build_cmd.on('close', function(exit_code){
            if(exit_code !== 0){
                console.log("failed to run gulp build script");
                process.exit(1);
            }
            done();
        });
    });

    it("zone_2 should include a point on the Quai d'Orléans", function(done){
        var geo = require('../lib/zone_geo_data'),
            turf = require('turf');

        var util = require('util');

        var zone_2 = _.find(geo.features, { properties: { zone_id: 'zone_2' }}),
            pt_quai_orleans = turf.point([ 2.354378700256347, 48.85157838128263 ]);

        console.log(util.inspect(zone_2.geometry.coordinates));

        turf.inside(pt_quai_orleans, zone_2).should.be.true();
        done();
    });

    it("should contain 4 zones with proper names", function(done){
        var geo = require('../lib/zone_geo_data');

        geo.features.length.should.equal(4);

        var ids = _.map(geo.features, 'properties.zone_id');
        _.intersection(ids, ['zone_1', 'zone_2', 'zone_3', 'zone_4']).length.should.equal(4);

        done();
    });

});
