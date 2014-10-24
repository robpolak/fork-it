var _ = require('underscore');
var reflectionApi = require('../helpers/reflectionHelper.js');
var logger = require('../helpers/logHelper.js');

/*
  The IPC bus class manager inter-prcoess communication between the processes.
  Params
    - subProcess : in the case of the child The forked object
 */
var ipcBus = function(processItem, obj, readyCb) {
  var receivedMessages = [];
  var sendingMessages = [];
  var schemaReceived = false;
  var processObj = {};

  var running = true;

  /*
   Description: Initializes the IPC Bus and wires the interprocess message command
   Params
    -
   Throws
    -
   */
  function init() {
    logger.log('verbose', 'IPC Bus Init');
    processItem.on('message', function (msg) {
      receivedMessages.push(msg);
    });
    poll();
    sendSchema();
  }

  /*
   Description: The object stub for which contains all methods/functions based on the schema
   */
  function Stub() {
    return processObj;
  }


  /*
   Description: Function Call Handler which is invoked on the stub object
   Params
   - type : invocation type.. i.e. function ..
   - func : function that was invoked
   - args : arguments on the function
   Throws
   -
   */
  function functionCallHandler(type, func, args) {
      args || (args = {});
      var msg = {
        func: func,
        args: Array.prototype.slice.call(args, 0)
      };
      sendMessage(type,msg);
  }

  /*
   Description: Property Call Handler which is invoked on the stub object
   Params
   - type : invocation type.. i.e. function ..
   - prop : property that was invoked
   - value : value that needs to be set
   Throws
   -
   */
  function propCallHandler(type, prop, value) {
    var msg = {
      prop: prop,
      value: Array.prototype.slice.call(value)[0]
    };
    sendMessage(type,msg);
  }

  /*
  * Polling loop
  * */
  function poll() {
    if(running) {
      checkBusReceive();
      checkBusPush();
      setTimeout(poll, 300);
    }
  }

  /*
  * Method to send the schema across the IPC channel
  * */
  function sendSchema() {
    var schemaObj = reflectionApi.getObjectSchema(obj);
    sendMessage("schema", {schema: schemaObj});
  }

  /*
  * Method that is invoked when the IPC bus receives a message from the process object.  Once it is invoked we look
  * at the message type to determine what to do with that message.
  *    - schema : this is sent as part of the initial process handshake.  This enables IPC function calls to start
  *    - function : Function was invoked
  *    - property : Property was changed
  * */
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
        processObj = reflectionApi.stubObject(schema, functionCallHandler,propCallHandler);
        if(readyCb && typeof(readyCb) === 'function') {
          logger.log('verbose', 'IPC Bus Ready');

        }
        if(readyCb && typeof readyCb === 'function') {
          readyCb();
        }
      }
      else {
        logger.log('error', 'Unknown type: '+ (msg.type || 'unknown') );
      }

      var index = sendingMessages.indexOf(msg);
      receivedMessages.splice(index, 1);
    });
  }

  /*
  * Method that handles pushing messages across the IPC Channel
  * */
  function checkBusPush() {
    for (var i = 0, len = sendingMessages.length; i < len; i++) {
      var msg = sendingMessages[i];
      if (msg) {
        logger.log('verbose', 'Sending Message' + JSON.stringify(msg));
        processItem.send(msg);
      }
      else {
        logger.log('error', 'Empty Message Detected');
      }
      sendingMessages.splice(i, 1);
    }

  }

  /*
  * Sends a message across the IPC Channel
  * */
  function sendMessage(type, msg) {
    sendingMessages.push( {
      type: type,
      message: msg
    });
  }

  init();

  return {
    sendMessage: sendMessage,
    Stub: Stub
  };
}

module.exports = ipcBus;