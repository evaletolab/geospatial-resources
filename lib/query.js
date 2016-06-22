/**
 * #Query
 * This is the controller of our geolocalisation service.
 * 
 * @author Olivier Evalet <evaleto@gmail.com>
 * @license GPL3 (see LICENSE)
 */

var config = require('./config');
var debug = config.debug;
var _=require('underscore');


var geo = exports;



/**
 * ## geo.Query(opts)
 * @param {Object} Query constructor options: 
 *	- driver: mongo, ...
 *  - X: ...
 *  - Y: ...
 * @constructor
 */
function Query(opts) {
  var self = this;
}

/**
 * ## geo.Query.isValid()
 * Validate the engine
 * @returns {Boolean} Validation result
 */
Query.prototype.isValid = function() {
};



/**
 * ## geo.Query.nearbySearch(request)
 * request bestresource near a position
 * @param {request} 
 * @return promise
 */
Query.prototype.nearbySearch = function(request) {
  var self = this,promise;
  //
  //validate request params

  // apply api implementation
  // promise=query_drv.r(request);
  // promise.then(function (result) {
  //   _.extend(self,result);
  // });
  return promise;
};




geo.Query = Query;
