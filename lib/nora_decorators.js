
exports.simplify_object = function(props_to_keep){
    
    return function(fn){
        var args = Array.prototype.slice.call(arguments),
        asset = fn.apply(this, args),
        result = {};

        props_to_keep.forEach(function(prop){
            result[prop] = asset[prop];
        });

        return result;
    };
};

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
