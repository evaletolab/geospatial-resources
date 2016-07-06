var model_data = require('./model_data'),
    zones = require('./zone_geo_data'),
    _ = require('lodash'),
    maybe = require('./nora_decorators').maybe,
    position_format_adapter = require('./nora_decorators').position_format_adapter,
    turf = require('turf');

var nora_db_factory = function(model_data, zones, _, turf){
    ///////////////
    // private

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
    var zone_for_point = function(geo_point){

        var includes_point = _.partial(turf.inside, geo_point),
            result =  _.find(zones.features, includes_point);

        if(result === undefined){
            return turf.point([ 10.1953125, 82.72096436126803 ], { zone_id: 'other' });
        }

        return result;
    };

    // given a zone id return all corresponding assets
    var assets_for_zone_id = function(zone_id){

        var get_zone = _.partialRight(_.get, 'zone'),
            includes_zone_id = _.partialRight(_.includes, zone_id),
            asset_has_zone_id = compose(includes_zone_id, get_zone);

        return _.filter(model_data.assets, asset_has_zone_id);
    };

    // narrative_position is the name property of a narrative_position
    var assets_with_zone_id_and_narrative_position = function(zone_id, narrative_position_name){
        var narrative_position = _.find(model_data.narrative_positions, {'name': narrative_position_name });

        if(narrative_position === undefined){
            console.log("no narrative position with name", narrative_position_name);
            return [];
        }

        return assets_for_zone_id(zone_id)
               .filter(function(asset){
                    return _.includes(asset.narrative_position, narrative_position.id);
               });
    };

    // API
    return {
        zone_for_point : maybe(position_format_adapter((zone_for_point))),

        assets_for_zone_id : maybe(assets_for_zone_id),
        
        assets_for_zone : compose(assets_for_zone_id,
                                      _.partialRight(_.get, 'properties.zone_id')),

        assets_with_zone_id_and_narrative_position: maybe(assets_with_zone_id_and_narrative_position)
    };

};


module.exports = {
    nora_db: nora_db_factory(model_data, zones, _, turf),
    nora_db_factory: nora_db_factory 
};
