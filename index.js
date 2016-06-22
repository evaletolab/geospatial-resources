/**
 * main module
 * Copyright (c)2014, by Olivier Evalet <evaleto@gmail.com>
 * Licensed under GPL license (see LICENSE)
 */

var config = require('./lib/config');

module.exports = function(_conf) {
	if(_conf){
		config.configure(_conf);
	}
	var geo = require('./lib/query');

	return {
		configure:config.configure,
		option:config.option,
		Query:new geo.Query()
	};
};
