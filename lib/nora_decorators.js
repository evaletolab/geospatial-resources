var turf = require('turf'),
    _ = require('lodash');


exports.jsonify = function(fn){

    var args = Array.prototype.slice.call(arguments),
        asset = fn.apply(this, args);

    return JSON.stringify(asset);
};

// maybe combinator
// decorate a function such that if any of its arguments are null, 
// the function is not applied
exports.maybe = function(fn){

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

// adapter decorator
// takes a function that takes a turf geo json point
// and make it accept a position object (https://developer.mozilla.org/en-US/docs/Web/API/Position)
exports.position_format_adapter = function(fn){

    return function(p){
        var lat = _.get(p, 'coords.latitude'),
            longi = _.get(p, 'coords.longitude');

        if(lat !== undefined && longi !== undefined){
            return fn(turf.point([longi, lat]));
        }else{
            return fn(p);
        }
    };
};
