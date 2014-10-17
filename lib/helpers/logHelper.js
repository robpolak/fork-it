var _ = require('underscore');

var LogHelper = function() {

}


function log(level, msg) {
  if(global.forkIt.config.logging.threshold === level) {
    var pid = process.pid;
    console.log('Level[' + level + '] Pid[' + pid + ']: ' + msg);
  }

  tryRaiseException(level,msg); //always try to raise the exception
}

function logAndThrow(level, msg) {
  log(level, msg);
  throw msg;
}

function tryRaiseException(level, msg) {
  try {
    if (global.forkIt.exceptionEvent && typeof global.forkIt.exceptionEvent === 'function') {
      global.forkIt.exceptionEvent(level, msg);
    }
  }
  catch(err) {
    console.log('failed to call Exception Event Handler' + err)
  }
}

LogHelper.prototype = {
  log: log,
  logAndThrow: logAndThrow
}


var logHelper = new LogHelper();
module.exports = logHelper;