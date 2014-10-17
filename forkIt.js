var logger = require('./lib/helpers/logHelper.js');
var proc = require('child_process');

var forkIt = function() {
  var ipcBus = require('./lib/ipc/ipcBus');
  var ipcBusObj = {};
  /*
   Description: Forks a Process
   Params
   - File:  relative path to the file
   Throws
   - File Not Specified
   */
  function fork(file ,obj , cb) {
    if (!file) {
      throw "File to Fork not specified";
    }

    var processObj = proc.fork(file);
    ipcBusObj = new ipcBus(processObj, obj, cb);
  }



  function initChild(obj, cb) {
    ipcBusObj = new ipcBus(process, obj, cb);
  }

  /*
   Description: Child Process Object
   Params
   - File:  relative path to the file
   Throws
   - File Not Specified
   */
  function child() {
    return ipcBusObj.Stub();
  }

  function parent() {
    return ipcBusObj.Stub();
  }

  return {
    fork: fork,
    child: child,
    parent: parent,
    initChild: initChild
  };
}

module.exports = forkIt;