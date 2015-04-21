
[![Build Status](https://api.travis-ci.org/robpolak/fork-it.svg)](https://travis-ci.org/robpolak/fork-it)
# fork-it
Fork-It is a NodeJs module that handles the complexity of interprocess communication.  This library will abstract the complexity of sending process messages between two components.  It also creates a communication layer between the two processes that is very RPC in nature.

# Status : BETA (unstable)

#### For Example:
Simple Parent/Child process relationship

*Parent.js*
```
var forkIt = require('fork-it');

var app = function() {};

//This will we the command we run cross process
app.prototype.someCommand = function(msg) {     
  console.log('App 1 Received: ' + msg);
};

//Now we fork the proc
forkIt.fork(__dirname, 'child.js', new app(), function() {
  forkIt.child().someCommand('From Parent'); //Invoke a method on Child.js
});
```

*Child.js*
``` 
var forkIt = require('fork-it');

//Set up our child method
var app = (function() {
  function someCommand(msg) {
    console.log('App 2 Received: ' + msg);
  };
  return {
    someCommand: someCommand
  };
}());

forkIt.initChild(app, function() {
  console.log('Child Ready.. sending message');
  forkIt.child().someCommand('From Child'); //Invoke a process on the Parent.js
});
```


### Installation
    $ npm install fork-it

## Bugs
See <https://github.com/robpolak/fork-it/issues>.    

### License

The MIT License (MIT)

Copyright (c) 2014 Robert Polak

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


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
var forkIt = require('fork-it');

var app = function() {

};

app.prototype.someCommand = function(msg) {
  console.log('App 1 Received: ' + msg);
};

forkIt.fork(__dirname, 'child.js', new app(), function() {
  forkIt.child().someCommand('From Parent');
});

```

#### Child.js

forkIt.initChild(obj, callBack);
  *obj*: The object you would like to share with the parent
  *callback*: Ready callback function

```
var forkIt = require('fork-it');

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
```
