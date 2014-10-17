var reflectionApi = require('../../helpers/reflectionHelper.js');
var proc = require('child_process');
var messageBus = require('./ipcMessageBus.js');
var messageBusObj;
var _ = require('underscore');
var _child = {};
var _parent = {};
var processObj = null;

function IpcBackbone() {
  messageBusObj = null;
}

function functionCallHandler(type, func, args) {
  if(_child) {
    var msg = {
      func: func,
      args: Array.prototype.slice.call(args, 0)
    };
    messageBusObj.queueChildMessage('function',msg);
  }
  else if(_parent) {

  }
}

function methodWrapper(func, args) {

}

function child() {
  return _child;
}

function initChild() {
  console.log("Process:"+ process);
  messageBus = require('./ipcChildMessageBus.js');
  messageBusObj = new messageBus(process, this);
}

function fork(file, parent) {
  var path1 = '../../../../../' + file;
  var childObj = require(path1);
  _child = reflectionApi.stubObject(childObj, functionCallHandler, methodWrapper);

  processObj = proc.fork('/proj/robpolak/fork-it/api.js');
  messageBusObj = new messageBus(processObj);
}

IpcBackbone.prototype = {
  fork: fork,
  child: child,
  initChild: initChild
}


module.exports = new IpcBackbone();