var gulp = require('gulp'),
    util = require('util'),
    import_airtable_to_json_file = require('./tools/airtable_import'),
    convert_zone_ids = require('./tools/convert_zone_ids'),
    json_to_lib = require('./tools/json_to_common_js_lib');


var airtable_json_file_path = './data/airtable_db.json',
    airtable_zone_ids_converted_json_file_path = './data/airtable_zone_ids_converted.json',
    env = process.env.NODE_ENV || 'development';

console.log(util.format("running in %s mode", env));

gulp.task('import_airtable', function(cb){

    import_airtable_to_json_file(airtable_json_file_path)
    .then(function(){
        cb();
    })
    .catch(function(reason){
        cb(reason);
    });
});

gulp.task('convert_zone_ids_to_human_readable', ['import_airtable'], function(cb){

    var in_file = airtable_json_file_path,
        out_file = airtable_zone_ids_converted_json_file_path;

    convert_zone_ids(in_file, out_file);

    cb();
});

gulp.task('convert_json_to_lib', ['convert_zone_ids_to_human_readable'], function(cb){
    
    json_to_lib(airtable_zone_ids_converted_json_file_path, './lib/model_data.js');

    var geojson_filpath = (env == 'development') ? './data/zones_dev.json' : './data/zones.json';

    json_to_lib(geojson_filpath, './lib/zone_geo_data.js');

    cb();
});


gulp.task('build_data_model', ['import_airtable', 'convert_zone_ids_to_human_readable', 'convert_json_to_lib']);
