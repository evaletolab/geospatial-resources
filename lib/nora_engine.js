var model_data = require('./model_data'),
    zones = require('./zone_geo_data'),
    _ = require('lodash'),
    turf = require('turf');



var nora_factory = function(model_data, zones, _, turf){
    ///////////////
    // private

    // maybe combinator
    // decorate a function such that if any of its arguments are null, 
    // the function is not applied
    var maybe = function(fn){

        return function(){
            var args = Array.prototype.slice.call(arguments);

            if(args.length == 0){
                return;
            }

            for(var i = 0; i < args.length; i++){
                if(args[i] == null){
                    return;
                }
            }
            return fn.apply(this, args);
        };
    };


    // function composition
    var compose = function(f1, f2){
        return function(a){
            return f1(f2(a));
        };
    };


    /////////////
    // public api

    // given a geo json point return first zone (geo_json feature) including point 
    // return point feature with zone_id = 'other' if no zone applies;
    var region_for_point = function(geo_point){

        var includes_point = _.partial(turf.inside, geo_point),
            result =  _.find(zones.features, includes_point);

        if(result === undefined){
            return turf.point([ 10.1953125, 82.72096436126803 ], { zone_id: 'other' });
        }

        return result;
    };

    // given a zone id return all corresponding assets
    var all_assets_for_zone_id = function(zone_id){

        var get_zone = _.partialRight(_.get, 'zone'),
            includes_zone_id = _.partialRight(_.includes, zone_id),
            asset_has_zone_id = compose(includes_zone_id, get_zone);

        return _.filter(model_data.assets, asset_has_zone_id);
    };


    // API
    return {
        region_for_point : maybe(region_for_point),

        all_assets_for_zone_id : maybe(all_assets_for_zone_id),
        
        all_assets_for_zone : compose(all_assets_for_zone_id,
                                      _.partialRight(_.get, 'properties.zone_id'))
    };

};


module.exports = {
    nora: nora_factory(model_data, zones, _, turf),
    nora_factory: nora_factory 
};
