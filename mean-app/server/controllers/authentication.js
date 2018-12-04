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
