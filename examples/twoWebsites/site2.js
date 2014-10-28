(function() {
  var http = require('http');
  var fs = require('fs');
  var index = fs.readFileSync('index.html');

  var url = require('url');
  var url_parts = url.parse(request.url, true);

  var forkIt = require('fork-it');
  forkIt.initChild(api);

  var receivedCommands = [];

  function pushCommand(cmd) {
    receivedCommands.push(cmd);
  }


  http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var query = url_parts.query;

    res.end(index);
  }).listen(9615);


})()