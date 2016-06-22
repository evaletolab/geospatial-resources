/**
 * #Motor
 
 *   service = new google.maps.places.PlacesService(map);
  	 service.nearbySearch(request, callback);

 * @author Olivier Evalet <evaleto@gmail.com>
 * @license GPL3 (see LICENSE)
 */

var config = require('./config');
var debug = config.debug;
var _=require('underscore');


var geo = exports;



/**
 * ## geo.Motor(opts)
 * @param {Object} opts Motor method options: 
 *  - src: path where XML source are loaded
 *  - dst: path where loaded XML are moved (only when XML is saved in DB)
 *  - save: default false, each loaded XML can be saved 
 * @constructor
 */
function Motor(opts) {
  var self = this;
}

/**
 * ## geo.Motor.isValid()
 * *Validate the geo data*
 * @returns {Boolean} Validation result
 */
Motor.prototype.isValid = function() {
};



/**
 * ## geo.Motor.retrieve(wid,callback)
 *
 * @param {Function} callback Expects err object
 */
Motor.prototype.retrieve = function(wallet) {
  var self = this,promise;
  promise=wallet_drv.retrieve(wallet);
  promise.then(function (wallet) {
    _.extend(self,wallet);
  });
  return promise;
};




geo.Motor = Motor;
