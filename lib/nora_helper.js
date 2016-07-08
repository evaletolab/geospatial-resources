

// http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
var random_int = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


var make_narrative_position_iterator = function(){
    // list of narrative position names in order of appearance
    var narrative_positions = ['Initiateur', 'Développement', 'Disparition', 'Conclusion'];

    var reset_narrative_position_asset_count = function(){
        return Math.max(random_int(2, 4), random_int(2, 5));
    };

    var index = 0,
        count = reset_narrative_position_asset_count(); 

    return {
        value: function (){
            return index < narrative_positions.length ? narrative_positions[index] : null;
        },
        next: function(){
    
            if(index >= narrative_positions.length){
                return this;
            }

            count--;

            if(count <= 0){
                index++;
                count = reset_narrative_position_asset_count();
            }
            return this;
        },
        increment_narrative_position: function(){
            index++;
            count = reset_narrative_position_asset_count();
            return this;
        }
    };
};

module.exports = {
    make_narrative_position_iterator: make_narrative_position_iterator
};
