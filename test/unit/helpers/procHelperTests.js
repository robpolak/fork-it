describe('Proc Helper Tests', function() {
  var expect = require('chai').expect;
  var sinon = require('sinon');

  var proc = require('child_process');
  var path = require('path');

  var procHelper;
  var forkIt;

  beforeEach(function() {
    procHelper = require('../../../lib/helpers/procHelper');
    forkIt = require('../../../fork-it');
  });

  afterEach(function () {
    proc.fork.restore();
    path.resolve.restore();
  });


  describe('Fork()', function () {
    it('should raise exception', function(done) {
      var pathStr = "path";
      var fileStr = "file";
      var resolveCalled = false;

      sinon.stub(path,'resolve', function(a,b) {
        expect(a).to.eql(pathStr);
        expect(b).to.eql(fileStr);
        resolveCalled = true;
        return "path_resolve";
      })
      sinon.stub(proc, 'fork', function(path, args) {
        expect(path).to.eql("path_resolve");
        if(resolveCalled)
          done();
        else
          throw "Failed to call path.resolve";
      });

      procHelper.fork(pathStr,fileStr);
    });

  });
});