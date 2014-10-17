h1 fork-it
===========

Fork-It is a NodeJs module that handles the complexity of interprocess communication.

h2 Usage

h3 Simple Example
h4 Parent.js
fork(directoryName, file, obj, callBack)
 - dirctoryName: Path where the file you want to fork is located
 - file: file to fork
 - obj: the object you wish to share with the child process
 - callback: ready callback function

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

h4 Child.js
forkIt.initChild(obj, callBack);
 - obj: The object you would like to share with the parent
 - callback: Ready callback function

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
