var nora_db = require('./nora_db').nora_db,
    jsonify = require('./nora_decorators').jsonify,
    util = require('util'),
    _ = require('lodash');

var simplify_object = function(props_to_keep){
    
    return function(obj){
        result = {};

        props_to_keep.forEach(function(prop){
            result[prop] = obj[prop];
        });

        return result;
    };
};

var nora_engine = function(){

    var last_gps_position = null;

    var narrative_positions = ['Initiateur', 'Développement', 'Disparition', 'Conclusion'],
        current_narrative_position_index = 0;

    var simplify_asset = simplify_object(['id', 'title', 'audio_file', 'doc_url', 'text', 'image']);


    // public api
    var update_position = function(position){
        last_gps_position = position;
    };

    var current_zone_id = function(){
        var zone = nora_db.zone_for_point(last_gps_position);
        return _.get(zone, 'properties.zone_id');
    };

    var assets_for_current_zone = function(){
        var zone = nora_db.zone_for_point(last_gps_position);
    
        return nora_db.all_assets_for_zone(zone).map(simplify_asset);
    };

    return {
        update_position: update_position,
        current_zone_id: current_zone_id,
        assets_for_current_zone: assets_for_current_zone
    };
};




module.exports = nora_engine;
