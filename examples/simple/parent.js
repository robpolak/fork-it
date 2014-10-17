var forkIt = require('../../fork-it.js');

var app = function() {

};

app.prototype.sendMessage = function(msg) {
  console.log('App 1 Received: ' + msg);
};

forkIt.fork(__dirname, 'child.js', new app(), function() {
  forkIt.child().sendMessage('From Parent');
});


