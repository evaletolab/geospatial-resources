/**
 * main module
 * Copyright (c)2014, by Olivier Evalet <evaleto@gmail.com>
 * Licensed under GPL license (see LICENSE)
 */


var nora = module.exports = require('./lib/nora_engine');
if(window){
    window.nora=nora;
}
