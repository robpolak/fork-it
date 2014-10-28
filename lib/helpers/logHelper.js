var _ = require('underscore');

var LogHelper = function() {

}

/*
 Description: Function that will log a message for a given logging level
 Params
 - level : String representation of the logging level (i.e. verbose/error/etc..)
 - msg : Error text
 Throws
 -
 */
function log(level, msg) {
  if(global.forkIt.config.logging.threshold === level || global.forkIt.config.logging.threshold === 'all') {
    var pid = process.pid;
    console.log('Level[' + level + '] Pid[' + pid + ']: ' + msg);
  }

  raiseException(level,msg); //always try to raise the exception
}

/*
 Description: Will log the exception and throw it after
 Params
 - level : String representation of the logging level (i.e. verbose/error/etc..)
 - msg : Error text
 Throws
 - Throws the content in the msg object for all invocations
 */
function logAndThrow(level, msg) {
  log(level, msg);
  throw msg;
}

/*
 Description: Raises an exception if there is a global listener attached on global.forkIt.exceptionEvent
 Params
 - level : String representation of the logging level (i.e. verbose/error/etc..)
 - msg : Error text
 Throws
 -
 */

function raiseException(level, msg) {
    if (global.forkIt.exceptionEvent && typeof global.forkIt.exceptionEvent === 'function') {
      global.forkIt.exceptionEvent(level, msg);
    }
}

LogHelper.prototype = {
  log: log,
  logAndThrow: logAndThrow
}


var logHelper = new LogHelper();
module.exports = logHelper;