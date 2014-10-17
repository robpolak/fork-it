var receivedMessages = [];
var sendingMessages = [];
var _ = require('underscore');
var parent;
var _childProc;
var _childObj;
var running = true;

var IpcChildMessageBus = function(childProc, childObj) {
  _childProc = childProc;
  _childObj = childObj;


  if(childProc) {
    console.log("child listening");
    childProc.on('message', function (msg) {
      receivedMessages.push({
        from: 'child',
        message: msg
      });
    });
  }

  running = true;
  poll();
}

function poll() {
  if(running) {
    checkBusReceive();
    setTimeout(poll, 300);
  }
}

function checkBusReceive() {
  _.each(receivedMessages, function(msg) {
    console.log('received'+ JSON.stringify(msg));
    var func = _childObj[msg.message.message.func];
    console.log('Func:' + msg.message.message.args);
    func.apply(_childObj, msg.message.message.args);

    var index = sendingMessages.indexOf(msg);
    receivedMessages.splice(index , 1);
  });
}

function sendMessage(type, msg) {
  sendingMessages.push( {
    from: 'child',
    type: type,
    message: msg
  });
}

function kill() {
  running = false;
}

IpcChildMessageBus.prototype = {
  kill: kill,
  sendMessage: sendMessage
};

module.exports = IpcChildMessageBus;

