# fork-it
===========
Fork-It is a NodeJs module that handles the complexity of interprocess communication.  This library will abstract the complexity of sending process messages between two components.  It also creates a communication layer between the two processes that is very RPC in nature.

#### For Example:
fork.child().childMethod(param1,param2,{options: 'foo'});
fork.parent().parentMethod(param1,param2,{options: 'foo'});


### Examples

#### Simple Example
Creates a simple Parent <--> Child console applications.  This example shows bi-directional communicate between processes

##### Parent.js

fork(directoryName, file, obj, callBack)
  *dirctoryName*: Path where the file you want to fork is located
  *file*: file to fork
  *obj*: the object you wish to share with the child process
  *callback*: ready callback function

```
var forkIt = require('../../fork-it.js');

var app = function() {

};

app.prototype.sendMessage = function(msg) {
  console.log('App 1 Received: ' + msg);
};

forkIt.fork(__dirname, 'child.js', new app(), function() {
  forkIt.child().sendMessage('From Parent');
});

```

#### Child.js

forkIt.initChild(obj, callBack);
  *obj*: The object you would like to share with the parent
  *callback*: Ready callback function

```
var forkIt = require('../../fork-it.js');

var app = (function() {
  function sendMessage(msg) {
    console.log('App 2 Received: ' + msg);
  };
  return {
    sendMessage: sendMessage
  };
}());

forkIt.initChild(app, function() {
  forkIt.child().sendMessage('From Child');
});


```
