var fs = require('fs'),
    util = require('util');


var json_to_lib = function(json_file_path, lib_file_path){
    
    var obj = JSON.parse(fs.readFileSync(json_file_path), 'utf-8'),
        obj_str = JSON.stringify(obj, null, 2); // ensure it is readable

    var result = "module.exports = " + obj_str;

    fs.writeFileSync(lib_file_path, result, 'utf-8');

};


module.exports = json_to_lib;
