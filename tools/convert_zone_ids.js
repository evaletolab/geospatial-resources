var fs = require('fs'),
    util = require('util'),
    _ = require('lodash'),
    assert = require('assert');

var rename_zone_ids = function(airtable_db){
    var zone_names = ["Libre", "Zone 1", "Zone 2" , "Zone 3",  "Zone 4"],
        desired_zone_ids = ['other', 'zone_1', 'zone_2', 'zone_3', 'zone_4'];
        zones_table = airtable_db.zones,
        zones = [],
        airtable_ids = []; // list of ids to converted to desired_zone_ids

    assert(zones_table.length == zone_names.length);

    zones = zone_names.map(function(n){
        var z = _.find(zones_table, {name: n});
        if(z === undefined){
            throw new Error('no zone for name ' + n);
        }
        return z;
    });

    // backup old id names
    airtable_ids = zones.map(function(z){
        var id = z.id;

        if(!_.isString(id)){
            throw new Error('invalid id for zone ' + util.inspect(z));
        }

        return z.id;
    });

    // replace all occurrences of airtable ids with desired ids
    // hackety hack convert to json and apply string replace

    var db_str = JSON.stringify(airtable_db);


    airtable_ids.forEach(function(id, index){
        var replacement = desired_zone_ids[index];
        db_str = db_str.replace(new RegExp(id, 'g'), replacement);
    });


    return JSON.parse(db_str);
};


// rename all zone ids from airtable structure to human readable format
var convert_zone_ids = function(airtable_json_file_path, output_file_name){

    var airtable_db = JSON.parse(fs.readFileSync(airtable_json_file_path, 'utf-8')),
        zones = JSON.parse(fs.readFileSync('./data/zones.json', 'utf-8')),
        zones_dev = JSON.parse(fs.readFileSync('./data/zones_dev.json', 'utf-8'));

    airtable_db = rename_zone_ids(airtable_db);

    fs.writeFileSync(output_file_name, JSON.stringify(airtable_db, null, 2), 'utf8');
};

module.exports = convert_zone_ids;
