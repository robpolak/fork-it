var forkIt = require('../../fork-it.js');
global.forkIt.config.logging.threshold = 'all';

var app = (function() {
  function someCommand(msg) {
    console.log('App 2 Received: ' + msg);
  };
  return {
    someCommand: someCommand
  };
}());

console.log('Child Loading');
forkIt.initChild(app, function() {
  console.log('Child Ready.. sending message');
  forkIt.child().someCommand('From Child');
});

