var _ = require('underscore');
var reflectionApi = require('../helpers/reflectionHelper.js');
var logger = require('../helpers/logHelper.js');


var ipcBus = function(subProcess, obj, readyCb) {
  var receivedMessages = [];
  var sendingMessages = [];
  var schemaReceived = false;
  var schemaObj = {};

  var running = true;

  function init() {
    if(subProcess) {
      logger.log('verbose', 'IPC Bus Init')
      subProcess.on('message', function (msg) {
        receivedMessages.push(msg);
      });
    }
    poll();
    sendSchema();
  }

  function Obj() {
    return obj;
  }

  function Stub() {
    return schemaObj;
  }


  function functionCallHandler(type, func, args) {
      args || (args = {});
      var msg = {
        func: func,
        args: Array.prototype.slice.call(args, 0)
      };
      sendMessage('function',msg);
  }

  function propCallHandler(type, prop, value) {
    var msg = {
      prop: prop,
      value: Array.prototype.slice.call(value)[0]
    };
    sendMessage('property',msg);
  }

  function poll() {
    if(running) {
      checkBusReceive();
      checkBusPush();
      setTimeout(poll, 300);
    }
  }

  function sendSchema() {
    var schema = reflectionApi.getObjectSchema(obj);
    sendMessage("schema", {schema: schema});
  }

  function checkBusReceive() {
    _.each(receivedMessages, function(msg) {

      logger.log('verbose', 'Message Received.. Type: '+msg.type+' Received'+ JSON.stringify(msg));
      if(msg.type === 'function') {
        var func = obj[msg.message.func];
        func.apply(obj, msg.message.args);
      }
      else if(msg.type === 'property') {
        obj[msg.message.prop] = msg.message.value;
      }
      else if(msg.type === 'schema') {
        schemaReceived = true;
        var schema = msg.message.schema;
        schemaObj = reflectionApi.stubObject(schema, functionCallHandler,propCallHandler);
        if(readyCb && typeof(readyCb) === 'function') {
          logger.log('verbose', 'IPC Bus Ready');

        }
        readyCb();
      }
      else {
        logger.log('error', 'Unknown type: '+ (msg.type || 'unknown') );
      }

      var index = sendingMessages.indexOf(msg);
      receivedMessages.splice(index, 1);
    });
  }

  function checkBusPush() {
    for(var i = 0, len = sendingMessages.length; i < len; i++) {
      var msg = sendingMessages[i];
      if(msg) {
        logger.log('verbose', 'Sending Message' + JSON.stringify(msg));
        subProcess.send(msg);
      }
      else {
        logger.log('error', 'Empty Message Detected');
      }
      sendingMessages.splice(i, 1);
    }
  }


  function sendMessage(type, msg) {
    sendingMessages.push( {
      type: type,
      message: msg
    });
  }

  init();

  return {
    sendMessage: sendMessage,
    Obj: Obj,
    Stub: Stub
  };
}

module.exports = ipcBus;