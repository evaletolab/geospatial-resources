// this script imports the airtable data to a set of json files
//

var fs = require('fs'),
    util = require('util'),
    assert = require('assert');
    _ = require('lodash'),
    airtable = require('airtable'),
    prop_translations = require('./airtable_prop_translations'),
    config = require('./config-airtable');

// collections
var assets = [],
    tags = [],
    themes = [],
    lit_forms = [],
    zones = [],
    characters = [],
    narrative_positions = [];

airtable.configure(config.auth);

var base = airtable.base(config.base_id);

// given a record and a translation dict
// return a record containing only the properties found in the keys of dict
// and translate the property names accorfing to the dict values
var parse_record = function(record, translation_dict){
    
    var result = {
        id : record.getId()
    };

    // reduce operation
    // key is french
    // value is english translation of property name
    return _.transform(translation_dict, function(result, value, key){
        result[value] = record.get(key);
    }, result);
};

// promisify the extraction of one table
var extract_table = function(base_name, view_name, translation_dict){
    var result = [];

    return new Promise(function(resolve, reject){
        base(base_name)
        .select({
                maxRecords: 500,
                view: view_name
        })
        .eachPage(function page(records, fetchNextPage) {

            // This function (`page`) will get called for each page of records.

            records.forEach(function(record) {
                // parse the record and only keep the fields we want
                var transformed_record = parse_record(record, translation_dict);
                result.push(transformed_record);
            });

            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage();

        }, function done(error) {
            if (error) {
                console.log(error);
                reject(error);
            }

            resolve(result);
        });
    });
};

var table_definitions = [
    {
        base_name:'LLDD',
        view_name: 'Regarder',
        translation_dict: prop_translations.asset_table,
        internal_table_name: 'assets'
    },
    {
        base_name:'Tags',
        view_name: 'Main View',
        translation_dict: prop_translations.tags_table,
        internal_table_name: 'tags'
    },
    {
        base_name:'Themes',
        view_name: 'Main View',
        translation_dict: prop_translations.themes_table,
        internal_table_name: 'themes'
    },
    {
        base_name:'Forme littéraire',
        view_name: 'Main View',
        translation_dict: prop_translations.litt_forms_table,
        internal_table_name: 'literary_forms'
    },
    {
        base_name:'Zones',
        view_name: 'Main View',
        translation_dict: prop_translations.asset_table,
        internal_table_name: 'zones'
    },
    {
        base_name:'Personnages',
        view_name: 'Main View',
        translation_dict: prop_translations.characters_table,
        internal_table_name: 'characters'
    },
    {
        base_name:'Position dans l\'histoire',
        view_name: 'Main View',
        translation_dict: prop_translations.narrative_position_table,
        internal_table_name: 'narrative_positions'
    }
];


// create a promise per table definition
var extract_tables_operation = table_definitions.map(function(def){
    return extract_table(def.base_name, def.view_name, def.translation_dict);
});

// run 
Promise.all(extract_tables_operation)
.then(function(collections){

    //collect arrays into an object dict
    var db = collections.reduce(function(result, next, index){
        var table_name = table_definitions[index].internal_table_name;
        result[table_name] = next;
        return result;
    }, {});

    return db;
})
.then(function(db){
    // write to disk
    var file_path = '../data/airtable_db.json';
    fs.writeFileSync(file_path, JSON.stringify(db, null, 2), 'utf-8');
    console.log("wrote", file_path);
});


