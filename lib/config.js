/**
 * #config
 * Copyright (c)2014, by Olivier Evalet <evaleto@gmail.com>
 * Licensed under GPL license (see LICENSE)
 */

var config = exports;
var util = require('util');
var isConfigured = false;

if (process.env.APP_ENV !== 'browser') {
  config.QUERY_VERSION = require('../package').version;
}

/**
 * ## settings
 * *Master configuration settings for Wallet*
 * 
 */
var settings = {};
settings.sandbox = false;
settings.debug = false; // Enables *blocking* debug output to STDOUT
settings.mongo={
  name:'mongodb://localhost/wallet-test',
  ensureIndex:true,
};

settings.apikey='123456789';
settings.secret='sdkwrucnskzeqw72408dhlkh';

config.reset=function(){
  if(process.env.NODE_ENV=='test'){
    settings.sandbox = false;
    settings.enabled = true;
    isConfigured=false;
  }
  else throw new Error('Reset is not possible here')
}
/**
 * ## config.debug(message)
 * *Wrapper around `util.debug` to log items in debug mode*
 *
 * This method is typically used by Wallet implementation to output debug 
 * messages. There is no need to call this method outside of Wallet.
 *
 * Note that any debug messages output using this function will block 
 * execution temporarily. It is advised to disable debug setting in production 
 * to prevent this logger from running.
 * 
 * @param {Object} message Object to be output as a message
 * @private
 */
config.debug = debug = function(message) {
  if (settings.debug) {
    util.debug(message);
  }
};

/**
 * ## config.configure(opts)
 *
 * If an invalid option is passed, it will throw an error.
 *
 * @param {Object} Configuration options
 */
config.configure = function(opts) {
  debug('Configuring Wallet with: \n' + util.inspect(opts));
  if (!opts.apikey) {
    throw new Error('Incomplete API credentials');
  }
  Object.keys(opts).forEach(function(key) {
    config.option(key, opts[key]);
  });
  isConfigured = true;
};

/**
 * ## config.option(name, [value])
 * *Returns or sets a single configuration option*
 *
 * @param {String} option Name of the option key
 * @param {Object} value New value of the option
 * @returns {Object} Value of the `option` key
 */
config.option = function(option, value) {
  if (typeof value !== 'undefined') {
    debug('Setting  key `' + option + '` to `' + value.toString() + '`');
    
    settings[options] = value;

  }
  return settings[option];
};

