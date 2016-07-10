

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

    var set_max_iterations = function(){
        return Math.max(random_int(2, 4), random_int(2, 5));
    };

    var increment_position_index = function(){
        index++;
        max_iterations_per_position = set_max_iterations();
        iteration_in_current_position = 0;
        secondary_amount = main_progression_amount / (max_iterations_per_position + 1);
    };

    var index = -1,
        max_iterations_per_position,
        iteration_in_current_position,
        main_progression_amount = 100 / narrative_positions.length,
        secondary_amount;

    increment_position_index();

    return {
        value: function (){
            if(index >= narrative_positions.length){
                return {
                    progression: 100,
                    name: null
                };
            }
            return {
                progression: (main_progression_amount * index) + (secondary_amount * iteration_in_current_position),
                name: narrative_positions[index]
            }
        },
        next: function(){
    
            if(index >= narrative_positions.length){
                return this;
            }

            iteration_in_current_position++;

            if(iteration_in_current_position > max_iterations_per_position){
                increment_position_index();
            }

            return this;
        },
        increment_narrative_position: function(){
            increment_position_index();
            return this;
        }
    };
};

module.exports = {
    make_narrative_position_iterator: make_narrative_position_iterator
};
