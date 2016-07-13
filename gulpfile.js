var gulp = require('gulp'),
    util = require('util'),
    import_airtable_to_json_file = require('./tools/airtable_import'),
    convert_zone_ids = require('./tools/convert_zone_ids'),
    json_to_lib = require('./tools/json_to_common_js_lib');


var airtable_json_file_path = './data/airtable_db.json',
    airtable_zone_ids_converted_json_file_path = './data/airtable_zone_ids_converted.json';


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

    var env = process.env.NODE_ENV || 'development',
        geojson_filepath = (env == 'development') ? './data/zones_dev.json' : './data/zones.json';

    json_to_lib(geojson_filepath, './lib/zone_geo_data.js');

    cb();
});


gulp.task('set_environment_to_production', function(cb){

    process.env.NODE_ENV = 'production';
    cb();
});

gulp.task('set_environment_to_development', function(cb){

    process.env.NODE_ENV = 'development';
    cb();
});

gulp.task('build_distribution', ['convert_json_to_lib'], function(cb){

    var spawn = require('child_process').spawn,
        webpack = spawn('webpack');

    webpack.stderr.on('data', function(data) {
        console.log('stderr:', data);
    });

    webpack.on('close', function(code) {
        if(code != 0){
            cb(new error("webpack process failure"));
        }else{
            cb();
        }
    });

});

gulp.task('build_data_model', ['import_airtable', 'convert_zone_ids_to_human_readable', 'convert_json_to_lib']);

gulp.task('build_library_for_production', ['set_environment_to_production',
                                           'import_airtable',
                                           'convert_zone_ids_to_human_readable',
                                           'convert_json_to_lib',
                                           'build_distribution']);

gulp.task('build_library_for_development', ['set_environment_to_development',
                                           'import_airtable',
                                           'convert_zone_ids_to_human_readable',
                                           'convert_json_to_lib',
                                           'build_distribution']);
