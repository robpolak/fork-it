var forkIt = require('../../fork-it.js');
global.forkIt.config.logging.threshold = 'all';

var app = function() {

};

app.prototype.someCommand = function(msg) {
  console.log('App 1 Received: ' + msg);
};

forkIt.fork(__dirname, 'child.js', new app(), function() {
  forkIt.child().someCommand('From Parent');
});


