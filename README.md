# fork-it
===========

Fork-It is a NodeJs module that handles the complexity of interprocess communication.

# Usage

Parent.js
```

```

Child.js

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
