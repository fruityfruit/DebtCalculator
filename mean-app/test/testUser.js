var mongoose = require('mongoose');
var User = mongoose.model('User'); //User schema from ../models/user.js
var assert = require('assert');

describe('User', function() {
  describe('#passwordValidation()', function() {
    it('should set and validate the password correctly', function() {
      var user = new User();
      var password = "dummyPassword";
      user.setPassword(password);
      var returnValue = user.validPassword(password);
      assert.ok(returnValue);
    })
  });
});

describe('User', function() {
  describe('#generateToken()', function() {
    it('should generate tokens, and tokens from different sessions should be different', function() {
      var user = new User();
      var token = user.generateToken();
      assert.ok(token);
      setTimeout(function() {
        var token2 = user.generateToken();
        assert.ok(token2);
        assert.notStrictEqual(token,token2);
      }, 3000);
    });
  });
});
