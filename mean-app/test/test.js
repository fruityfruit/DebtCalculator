var db = require('../server/models/db');
var mongoose = require('mongoose');
var User = mongoose.model('User'); //User schema from ../models/user.js
var assert = require('assert');

describe('User', function() {
  describe('#generateToken()', function() {
    it('should generate a token without an error', function() {
      var user = new User();
      var token = user.generateToken();
      assert.ok(token);
    });
  });
});

mongoose.connection.close();
