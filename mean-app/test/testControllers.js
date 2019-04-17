var db = require('../server/models/db');
var mongoose = require('mongoose');
var routes = require('../server/routes/routes.js');
var should = require('should');
var assert = require('assert');
var request = require('supertest');

describe('Authentication', function() {
  describe('#register()', function() {
    it('should register the user and return a 200 value', function(done) {
      var username = "dummyUsername";
      var password = "dummyPassword";
      request(routes)
        .post('/register')
        .send({"username":username,
               "password":password})
        .expect(200);
      request(routes)
        .post('/register')
        .send({"username":"",
               "password":password})
        .expect(200);
      done();
    });
  });
  describe('#signin()', function() {
    it('should log in the user and return a 200 value', function(done) {
      var username = "dummyUsername";
      var password = "dummyPassword";
      request(routes)
        .post('/signin')
        .send({"username":username,
               "password":password})
        .expect(200);
      done();
    });
  });
  describe('#updateUsername()', function() {
    it('should update the user username and return a 200 value', function(done) {
      var oldUsername = "dummyUsername";
      var password = "dummyPassword";
      var newUsername = "newUsername";
      request(routes)
        .post('/username')
        .send({"oldUsername":oldUsername,
               "password":password,
               "newUsername":newUsername})
        .expect(200);
      done();
    });
  });
  describe('#updatePassword()', function() {
    it('should update the user password and return a 200 value', function(done) {
      var oldPassword = "dummyPassword";
      var username = "newUsername";
      var newPassword = "newPassword";
      request(routes)
        .post('/password')
        .send({"oldPassword":oldPassword,
               "username":username,
               "newPassword":newPassword})
        .expect(200);
      done();
    });
  });
  describe('#deleteUser()', function() {
    it('should delete the user and return a 200 value', function(done) {
      var username = "newUsername";
      var password = "newPassword";
      request(routes)
        .post('/delete')
        .send({"username":username,
               "password":password})
        .expect(200);
      done();
    });
  });
});
