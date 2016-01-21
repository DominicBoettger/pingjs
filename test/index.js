/**
 * Created by Dominic Böttger on 11.05.2014
 * INSPIRATIONlabs GmbH
 * http://www.inspirationlabs.com
 */
'use strict';
var should = require('should');
var pingermod = require('../');
var pinger = new pingermod();

describe('pinger', function() {
  var promise;

  before(function() {
      promise = pinger.ping('8.8.8.8', {
       count: 10,
       timeout: 1000
     });
  });

  it('should ping a system', function(done) {
    promise.then(function(state) {
       state.should.be.an.instanceOf(Object)
       .and.have.property('destination', '8.8.8.8');
       done();
    });
  });

  it('should have a pings array', function(done) {
    promise.then(function(state) {
       state.pings.should.be.an.instanceOf(Array).with.lengthOf(10);
       done();
    });
  });

  it('should have a result object with sent property', function(done) {
    promise.then(function(state) {
       state.pings[0].should.be.an.instanceOf(Object)
       .and.have.property('received');
       done();
    });
  });

  it('should have a result object with received property', function(done) {
    promise.then(function(state) {
       state.pings[0].should.be.an.instanceOf(Object)
       .and.have.property('received');
       done();
    });
  });

  it('should have a result object with time property', function(done) {
    promise.then(function(state) {
       state.pings[0].should.be.an.instanceOf(Object)
       .and.have.property('received');
       done();
    });
  });
});
