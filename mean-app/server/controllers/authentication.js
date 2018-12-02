var mongoose = require('mongoose');
var User = mongoose.model('User'); //User schema from ../models/user.js

module.exports.register = function(req, res) {
  var user = new User();
  user._id = new mongoose.Types.ObjectId();
  user.username = req.body.username; // set username
  user.setPassword(req.body.password); // set password
  user.save(function(err) { // save user to database
    var token;
    token = user.generateToken();
    if (!err) { // everything is good
      res.status(200).json({
        "token" : token,
        "username" : req.body.username
      }); // return the token and username
    } else { // everything is not good
      res.status(400).json(err); // return the error
    }
  });
};

module.exports.signin = function(req, res) {
  User.findOne({ username: req.body.username }, function (err, user) { //search the database for a user with the right username
    if (err) { //something went wrong
      res.status(500).json(err);
    } else if (!user || !user.validPassword(req.body.password)) { //the username doesn't exist or the password is wrong
      res.status(401).json({
        "message": 'Username or password incorrect'
      });
    } else { //all is well
      var token;
      token = user.generateToken();
      res.status(200).json({
        "token": token,
        "username" : req.body.username
      }); //return the token and username
    }
  });

};
