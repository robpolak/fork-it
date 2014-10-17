var receivedMessages = [];
var sendingMessages = [];
var _ = require('underscore');
var _childProc;
var childObj;
var running = true;

var IpcMessageBus = function(childProc) {
  _childProc = childProc;

  running = true;
  poll();
}

function poll() {
  if(running) {
    checkBusPush();
    setTimeout(poll, 300);
  }
}


function checkBusPush() {
  _.each(sendingMessages, function(msg) {
    console.log('message sent'+ JSON.stringify(msg));
    _childProc.send(msg);
    var index = sendingMessages.indexOf(msg);
    sendingMessages.splice(index , 1);
  });
}

function kill() {
  running = false;
}

function queueChildMessage(type,msg) {
  sendingMessages.push( {
    from: 'parent',
    type: type,
    message: msg
  });
}

IpcMessageBus.prototype = {
  kill: kill,
  queueChildMessage: queueChildMessage
};

module.exports = IpcMessageBus;

