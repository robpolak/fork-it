var reflectionApi = require('../../helpers/reflectionHelper.js');
var messageBus = require('./ipcChildMessageBus.js');
var messageBusObj;
var _ = require('underscore');
var reflectionApi = require('../../helpers/reflectionHelper.js');


function IpcChildBackbone() {
}


function initChild(obj) {
  var schema = reflectionApi.stubObject(childObj, functionCallHandler, methodWrapper);
  console.log("Process:"+ process);
  messageBusObj = new messageBus(process, obj);
  messageBusObj.queueChildMessage("")
}


IpcChildBackbone.prototype = {
  initChild: initChild
}


module.exports = new IpcChildBackbone();