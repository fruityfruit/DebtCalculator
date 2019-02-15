var mongoose = require('mongoose');
var User = mongoose.model('User'); //User schema from ../models/user.js

//registers and logs in a new user
module.exports.register = function(req, res) {
  var user = new User();
  user._id = new mongoose.Types.ObjectId();
  user.username = req.body.username;
  user.setPassword(req.body.password);
  //save user to database
  user.save()
    .then(user => {
      var token;
      token = user.generateToken();
      res.status(200).json({
        "token" : token,
        "username" : user.username
      });
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

//logs in a user that has already registered
module.exports.signin = function(req, res) {
  User.findOne({ username: req.body.username }, function (err, user) { //finds the user
    if (err) { //return the error
      res.status(400).json(err);
    } else if (!user || !user.validPassword(req.body.password)) { //the username doesn't exist or the password is wrong
      res.status(401).json({"message": 'Username or password incorrect'});
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

//updates a user's username in the database
module.exports.updateUsername = function(req, res) {
  User.findOne({ username: req.body.oldUsername }, function (err, user) { //finds the user
    if (err) { //return the error
      res.status(400).json(err);
    } else if (!user || !user.validPassword(req.body.password)) { //the username doesn't exist or the password is wrong
      res.status(401).json({"message": 'Password is incorrect'});
    } else { //return the token and new username
      user.username = req.body.newUsername;
      //save user to database
      user.save()
        .then(user => {
          var token;
          token = user.generateToken();
          res.status(200).json({
            "token" : token,
            "username" : user.username
          });
        })
        .catch(err => {
          res.status(400).json(err);
        });
    }
  });
};

//updates a user's password in the database
module.exports.updatePassword = function(req, res) {
  User.findOne({ username: req.body.username }, function (err, user) { //finds the user
    if (err) { //return the error
      res.status(400).json(err);
    } else if (!user || !user.validPassword(req.body.oldPassword)) { //the username doesn't exist or the password is wrong
      res.status(401).json({"message": 'Old password is incorrect'});
    } else { //return the token and username
      user.setPassword(req.body.newPassword);
      //save user to database
      user.save()
        .then(user => {
          var token;
          token = user.generateToken();
          res.status(200).json({
            "token" : token,
            "username" : user.username
          });
        })
        .catch(err => {
          res.status(400).json(err);
        });
    }
  });
};

//deletes a user from the database
module.exports.deleteUser = function(req, res) {
  User.findOne({ username: req.body.username }, function (err, user) { //finds the user
    if (err) { //return the error
      res.status(400).json(err);
    } else if (!user || !user.validPassword(req.body.password)) { //the username doesn't exist or the password is wrong
      res.status(401).json({"message": 'Password is incorrect'});
    } else { //find and delete the user
      User.deleteOne({ username: req.body.username }, function (err) {
        if (err) { //return the error
          res.status(400).json(err);
        }
        res.status(200).json({}); //return a blank 200 status
      });
    }
  });
}
