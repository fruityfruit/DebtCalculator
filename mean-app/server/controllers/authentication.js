var mongoose = require('mongoose');
var User = mongoose.model('User'); //User schema from ../models/user.js

module.exports.register = function(req, res) {
  var user = new User();
  user._id = new mongoose.Types.ObjectId();
  user.username = req.body.username;
  user.setPassword(req.body.password);
  user.save(function(err) { //save user to database
    if (!err) { //return the username and token
      var token;
      token = user.generateToken();
      res.status(200).json({
        "token" : token,
        "username" : user.username
      });
    } else { //return the error
      res.status(400).json(err);
    }
  });
};

module.exports.signin = function(req, res) {
  User.findOne({ username: req.body.username }, function (err, user) { //search the database for a user with the right username
    if (err) { //return the error
      res.status(400).json(err);
    } else if (!user || !user.validPassword(req.body.password)) { //the username doesn't exist or the password is wrong
      res.status(401).json({
        "message": 'Username or password incorrect'
      });
    } else { //return the token and username
      var token;
      token = user.generateToken();
      res.status(200).json({
        "token": token,
        "username" : user.username
      });
    }
  });
};
