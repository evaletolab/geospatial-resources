// set of mappings between properties as expressed in the airtable db
// and their equivalent in our own naming convention (english - lower case - snake_case) 
//
// the set of properties also defines the set of properties to be extracted

var translations = {
    asset_table: {
        'Titre du document': 'title',
        'Document audio attaché': 'audio_file',
        'Date de création': 'creation_date',
        'Zone': 'zone',
        'Vitesse (1 à 10)': 'speed',
        'Tags': 'tags',
        'themes': 'themes',
        'Position dans l\'histoire': 'narrative_position', 
        'Forme littéraire': 'literary_form',
        'Personnages': 'characters',
        'url du document': 'doc_url',
        'Image attachée': 'image',
        'Texte complet': 'text'
    },
    tags_table: {
        'name': 'name',
        'Assets': 'assets'
    },
    themes_table: {
        'name': 'name',
        'Assets': 'assets'
    },
    literary_forms_table: {
        'name': 'name',
        'Assets': 'assets'
    },
    zones_table: {
        'name': 'name',
        'description': 'description',
        'Assets': 'assets'
    },
    characters_table: {
        'name': 'name',
        'Assets': 'assets'
    },
    narrative_position_table: {
        'name': 'name',
        'Description': 'description',
        'Assets': 'assets'
    }
};

module.exports = translations;
