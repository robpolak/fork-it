describe('Reflection Helper Tests', function() {
  var expect = require('chai').expect;
  var sinon = require('sinon');
  var reflectionHelper = require('../../../lib/helpers/reflectionHelper');;
  var forkIt;

  beforeEach(function() {

  });


    describe('GetProperties', function() {

      it('GetProperties Returns all fields', function() {
        var obj = {
          method1: function() {},
          method2: function() {},
          prop1: 34,
          prop2: 32,
          method3: function() {}
        };

        var results = reflectionHelper.getProperties(obj);

        expect(results.length).to.eql(2);
        expect(results).to.contain('prop1');
        expect(results).to.contain('prop2');
        expect(results).to.not.contain('method1');

      });

    });

  describe('GetMethods', function() {

    it('GetMethods Returns all methods', function() {
      var obj = {
        method1: function() {},
        method2: function() {},
        prop1: 34,
        prop2: 32,
        method3: function() {}
      };

      var results = reflectionHelper.getMethods(obj);

      expect(results.length).to.eql(3);
      expect(results).to.contain('method1');
      expect(results).to.contain('method2');
      expect(results).to.contain('method3');
      expect(results).to.not.contain('prop1');
    });
  });

  describe('GetObjectSchema', function() {

    it('getObjectSchema Returns proper object structure', function() {
      var obj = {
        method1: function() {},
        method2: function() {},
        prop1: 34,
        prop2: 32,
        method3: function() {}
      };

      var results = reflectionHelper.getObjectSchema(obj);

      expect(results.functions.length).to.eql(3);
      expect(results.properties.length).to.eql(2);

      expect(results.functions).to.contain('method1');
      expect(results.functions).to.contain('method2');
      expect(results.functions).to.contain('method3');
      expect(results.properties).to.contain('prop1');
      expect(results.properties).to.contain('prop2');
    });
  });


  describe('stubObject', function() {

    it('stubObject stubs functions', function(done) {
      var obj = {
        method1: function() {},
        method2: function() {},
        prop1: 34,
        prop2: 32,
        method3: function() {}
      };

      var funcCb = function(func, method, args) {
        expect(func).to.eql("method");
        expect(method).to.eql("method1");
        expect(args[0]).to.eql(1);
        expect(args[1]).to.eql(5);
        expect(args[2]).to.eql("10");
        done();
      }


      var results = reflectionHelper.stubObject(reflectionHelper.getObjectSchema(obj),funcCb, function(){});

      results.method1(1,5,"10");
    });
  });

});