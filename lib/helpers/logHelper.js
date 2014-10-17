var _ = require('underscore');

var LogHelper = function() {

}

function log(level, msg) {
  var pid = process.pid;
  console.log('Level['+level+'] Pid['+pid+']: '+ msg);
}

LogHelper.prototype = {
  log: log
}


var logHelper = new LogHelper();
module.exports = logHelper;