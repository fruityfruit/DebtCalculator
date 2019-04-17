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

var username = "dummyUsername";
var password = "dummyPassword";
request(routes)
  .post('/register')
  .send({"username":username,
         "password":password})
  .expect(200);

describe('Opportunity', function() {
  describe('#createOpp()', function() {
    it('should register the opp and return a 200 value', function(done) {
      request(routes)
        .post('/opportunity')
        .send({
          "username":username,
          "type":"job",
          "name":"opp1",
          "state":"SC",
          "city":"Columbia",
          "region":"0000",
          "income":"50000",
          "bonus":"5000",
          "move":"Yes",
          "principal":"10000",
          "rate":"6",
          "annualCompounds":"12",
          "monthlyPayment":"300"})
        .expect(200);
      done();
    });
  });
});

describe('Profile', function() {
  describe('#updateProfile()', function() {
    it('should update the profile of the user and return a 200 value', function(done) {
      request(routes)
        .post('/personal')
        .send({
          "username":username,
          "state":"SC",
          "region":"0000",
          "groceries":"300",
          "rent":"1000",
          "spending":"1000",
          "savings":"3000"})
        .expect(200);
      done();
    });
  });
  describe('#createDebt()', function() {
    it('should create the debt and return a 200 value', function(done) {
      request(routes)
        .post('/debt')
        .send({
          "username":username,
          "name":"debt1",
          "principal":"10000",
          "rate":"6",
          "annualCompounds":"12",
          "monthlyPayment":"300"})
        .expect(200);
      done();
    });
  });
});

describe('Result', function() {
  describe('#getBLS()', function() {
    it('should get the BLS data and return a 200 value', function(done) {
      request(routes)
        .post('/bls')
        .send(["0000", "0100", "0200", "0300"])
        .expect(200);
      done();
    });
  });
});
