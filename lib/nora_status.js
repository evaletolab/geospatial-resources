
var status = function(code, message){
    return function(maybe_message){
        
        return {
            code: code,
            message: maybe_message || message
        };
    }; 
};

module.exports = {
    ok: status(0, 'operation succesful'),
    uninitialized_gps_position: status(1, 'uninitialized gps position'),
    story_ended: status(2, 'story ended (no more narrative positions)')
};
