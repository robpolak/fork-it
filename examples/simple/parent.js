var forkIt = require('../../fork-it.js');

var app = function() {

};

app.prototype.someCommand = function(msg) {
  console.log('App 1 Received: ' + msg);
};

forkIt.fork(__dirname, 'child.js', new app(), function() {
  forkIt.child().someCommand('From Parent');
});


