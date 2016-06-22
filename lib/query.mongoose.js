
var debug = require('debug')('account')
  , config = require('./config')
  , _ =require('underscore')
  , assert = require("assert")
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Promise = mongoose.Promise
  , ObjectId = Schema.ObjectId;
  
//
// Mongo geospatial query for Inclusion, Intersection and Proximity
// https://docs.mongodb.com/manual/applications/geospatial-indexes/  

//
// custom connection
if(config.option('mongo').multiple){
  mongoose=mongoose.createConnection(config.option('mongo').name);
}

var Query_drv = new Schema({

  //
  // this is secret key where this Query_drv lives 
  apikey:{type:String,required: true},

  //
  //
  available:{type:Boolean,required: true,default:false,select:false}

});

//
// serialisation
Query_drv.set('toObject',{
  transform:function (doc,ret,options) {
    delete ret.__v;
    delete ret._id;
    delete ret.apikey;
    delete ret.available;
    return ret;
  }
});


Query_drv.pre('save',function (next) {
    return next();
});

//
// simple method
Query_drv.methods.name=function() {
  return ;
};

//
// simple function
Query_drv.statics.nearbySearch = function(options,callback){
  var promise = new Promise;
  if(callback){promise.addBack(callback);}

  assert(options);
  assert(options.field);

}; 



Query_drv.set('autoIndex', config.option('mongo').ensureIndex);
module.exports =mongoose.model('Queries', Query_drv);


