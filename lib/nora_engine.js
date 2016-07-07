var nora_db = require('./nora_db').nora_db,
    status_factory = require('./nora_status'),
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

// http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
var random_int = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var reset_narrative_position_asset_count = function(){
    return Math.max(random_int(1, 4), random_int(1, 4));
};

var nora_engine = function(){

    var last_gps_position = null;

    var narrative_positions = ['Initiateur', 'Développement', 'Disparition', 'Conclusion'],
        current_narrative_position_index = 0,
        current_narrative_position_asset_count = reset_narrative_position_asset_count();

    var simplify_asset = simplify_object(['id', 'title', 'audio_file', 'doc_url', 'text', 'image']);

    var played_assets = [],
        _current_asset = null;

    // 
    var compute_next_asset = function(){

        var zone_id = current_zone_id(),
            narrative_position_name = narrative_positions[current_narrative_position_index];

        var compute_asset_pool = function(){
             var pool = nora_db.assets_with_zone_id_and_narrative_position(zone_id, narrative_position_name);

             // console.log(util.inspect(pool));

             return _.differenceBy(pool, played_assets, 'id');
        }

        var asset_pool = compute_asset_pool();

        while(asset_pool.length == 0){
            current_narrative_position_index += 1;
            current_narrative_position_asset_count = reset_narrative_position_asset_count();
            if(current_narrative_position_index == narrative_positions.length){
                console.log("narrative positions exhausted");
                return null;
            }
            asset_pool = compute_asset_pool();
        }

        var asset = _.chain(asset_pool).shuffle().take(1).value();

        current_narrative_position_asset_count -= 1;

        if(current_narrative_position_asset_count == 0){
            // change narrative position
            console.log("update narrative position")
            current_narrative_position_index += 1;
            current_narrative_position_asset_count = reset_narrative_position_asset_count();
        }
    
        return asset;
    }

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
    
        return nora_db.assets_for_zone(zone).map(simplify_asset);
    };

    var current_asset = function(){
        if(last_gps_position === null){
            // uninitialized gps position
            return {
                status: status_factory.uninitialized_gps_position(),
                asset: null
            }
        }

        if(current_narrative_position_index >= narrative_positions.length){
            // exhausted all narrative positions
            
            return {
                status: status_factory.story_ended(),
                asset: null
            }
        }

        if(_current_asset == null){
            console.log("compute next asset");
            _current_asset = compute_next_asset();
        }

        return {
            status: status_factory.ok(),
            asset: _current_asset
        }
    };

    // current asset media is consumed
    // 1. push old media on stack of old media
    // 2. invalidate _current_asset
    var signal_asset_complete = function(){
        if(_current_asset != null){
            played_assets.push(_current_asset);
        }

        _current_asset = null;

        return current_asset();
    };

    return {
        update_position: update_position,
        current_zone_id: current_zone_id,
        assets_for_current_zone: assets_for_current_zone,
        current_asset: current_asset,
        signal_asset_complete: signal_asset_complete
    };
};




module.exports = nora_engine;
