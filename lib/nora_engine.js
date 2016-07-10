var nora_db = require('./nora_db').nora_db,
    status_factory = require('./nora_status'),
    jsonify = require('./nora_decorators').jsonify,
    maybe = require('./nora_decorators').maybe,
    make_narrative_position_iterator = require('./nora_helper').make_narrative_position_iterator,
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

    var narrative_position_iterator = make_narrative_position_iterator(),
        progression = narrative_position_iterator.value();

    var simplify_asset = maybe(simplify_object(['id', 'title', 'audio_file', 'doc_url', 'text', 'image']));

    var played_assets = [],
        _current_asset = null;

    // returns next asset, or null if no asset available (end story state)
    var compute_next_asset = function(){

        // invalid state
        if(progression.name == null){
            return null;
        }

        var zone_id = current_zone_id();

        var compute_asset_pool = function(){
             var pool = nora_db.assets_with_zone_id_and_narrative_position(zone_id, progression.name);

             return _.differenceBy(pool, played_assets, 'id');
        };

        var asset_pool = compute_asset_pool(),
            asset;

        if(asset_pool.length > 0){
            progression = narrative_position_iterator.next().value();
            asset = _.chain(asset_pool).shuffle().head(1).value();
            return asset;
        }

        while(asset_pool.length == 0){
            // no available media of type progression in current_zone
            // increment narrative position
            progression = narrative_position_iterator.increment_narrative_position().value();

            if(progression.name === null){
                console.log("narrative positions exhausted");
                return null;
            }   
            console.log("progression", progression);
            asset_pool = compute_asset_pool();
        }

        asset = _.chain(asset_pool).shuffle().head(1).value();
    
        return asset;
    };

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
                asset: null,
                progression: progression
            }
        }

        if(_current_asset == null){
            console.log("compute next asset");
            
            _current_asset = compute_next_asset();

            if(_current_asset == null){
                return {
                    status: status_factory.story_ended(),
                    asset: null,
                    progression: progression
                }
            }
        }

        return {
            status: status_factory.ok(),
            asset: simplify_asset(_current_asset),
            progression: progression
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
