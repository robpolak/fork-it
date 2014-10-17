var _ = require('underscore');

var ReflectionHelper = function() {

}

function getProperties(obj) {

  var properties = [];
  for(var prop in obj) {
    if(typeof(obj[prop]) != 'function') {
      properties.push(prop);
    }
  }

  return properties;
}

function getMethods(obj) {
  var methods = [];
  for(var method in obj) {
    if(typeof(obj[method]) == 'function') {
      methods.push(method);
    }
  }
  return methods;
}

function getObjectSchema(obj) {
  var schema = {
    functions: [],
    properties: []
  };
  _.each(getMethods(obj), function(method) {
    schema.functions.push(method);
  });

  _.each(getProperties(obj), function(prop) {
    schema.properties.push(prop);
  });
  return schema;
}

function stubObject(schema, funcCb, propCb) {
  var obj = {};
  _.each(schema.functions, function(method) {
    obj[method] = function() {
      funcCb("method", method, arguments);
    }
  });

  _.each(schema.properties, function(prop) {
    obj[prop] = function() {
      propCb("property", prop, arguments);
    }
  });
  return obj;
}

ReflectionHelper.prototype = {
  getProperties: getProperties,
  getMethods: getMethods,
  stubObject: stubObject,
  getObjectSchema:getObjectSchema,
}


var reflectionHelper = new ReflectionHelper();
module.exports = reflectionHelper;