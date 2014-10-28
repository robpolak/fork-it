describe('Log Helper Tests', function() {
  var expect = require('chai').expect;
  var sinon = require('sinon');
  var logHelper;
  var forkIt;

  beforeEach(function() {
    logHelper = require('../../../lib/helpers/logHelper');
    forkIt = require('../../../../fork-it');
    global.forkIt.config.logging.threshold = 'testing';
  });

  describe('Log()', function () {
    it('should raise exception', function(done) {
      var level = 'testing';
      var msg = 'test message';
      global.forkIt.exceptionEvent = function(passedLevel, passedMsg) {
        expect(msg).to.eql(passedMsg);
        expect(level).to.eql(passedLevel);
        done();
      };

      logHelper.log(level, msg);
    });
  });


});