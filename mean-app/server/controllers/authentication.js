var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.register = function(req, res) {

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password);

  user.save(function(err) {
    var token;
    token = user.generateToken();
    if (!err) {
      res.status(200).json({
        "token" : token
      });
    } else {
      res.status(400).json(err);
    }
  });

};

module.exports.signin = function(req, res) {
  // passport.authenticate('local', function(err, user, info){
  //   var token;
  //
  //   // If Passport throws/catches an error
  //   if (err) {
  //     res.status(404).json(err);
  //     return;
  //   }
  //
  //   // If a user is found
  //   if(user){
  //     //token = user.generateJwt();
  //     res.status(200);
  //     res.json({
  //       "token" : 'dummy token'
  //     });
  //   } else {
  //     // If user is not found
  //     res.status(401).json(info);
  //   }
  // })(req, res);
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) {
      res.status(500).json(err);
    } else if (!user || !user.validPassword(req.body.password)) {
      res.status(401).json({
        "message": 'Username or password incorrect'
      });
    } else {
      var token;
      token = user.generateToken();
      res.status(200).json({
        "token": token
      });
    }
  });

};
