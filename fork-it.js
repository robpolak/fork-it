var logger = require('./lib/helpers/logHelper.js');
var proc = require('./lib/helpers/procHelper.js');

//Setup the Global Config Object with defaults
global.forkIt = {};
global.forkIt.config = {
  logging: {
    threshold: "error"
  }
}

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
  function fork(path, file ,obj , cb) {
    if (!file) {
      throw "File to Fork not specified";
    }

    var processObj = proc.fork(path, file);
    ipcBusObj = new ipcBus(processObj, obj, cb);
  }


  /*
   Description: This method initializes the child object
   Params
   - obj:  object that will be shared to the parent process
   - cb:   callback one the IPC bus has been instantiated
   Throws
   - File Not Specified
   */
  function initChild(obj, cb) {
    if(!obj)
      throw "Cannot pass a null object";

    ipcBusObj = new ipcBus(process, obj, cb);
  }

  /*
   Description: Child Process Object
   Params
   -
   Throws
   -
   */
  function child() {
    return ipcBusObj.Stub();
  }

  /*
   Description: Parent Process Object
   Params
   -
   Throws
   -
   */
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

module.exports = forkIt();