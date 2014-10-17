var logger = require('./logHelper.js');
var proc = require('child_process');
var path = require('path');

var ProcHelper = function() {

}

function fork(path1, fileName) {
  if(!fileName) {
    logger.logAndThrow('error', "File Name not specified");
    throw err;
  }
  try {
    var c = path.resolve (path1,fileName);
    var processObj = proc.fork(c,[],{});
    return processObj;
  }
  catch(err) {
    logger.logAndThrow('error', "Error Forking File:" + err);
  }
}

ProcHelper.prototype = {
  fork: fork
}

var procHelper = new ProcHelper();
module.exports = procHelper;