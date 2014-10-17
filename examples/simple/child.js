var forkIt = require('../../fork-it.js');

var app = (function() {
  function someCommand(msg) {
    console.log('App 2 Received: ' + msg);
  };
  return {
    someCommand: someCommand
  };
}());

forkIt.initChild(app, function() {
  forkIt.child().someCommand('From Child');
});

