var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.register = function(req, res) {

  // if(!req.body.name || !req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  var user = new User();

  user.username = req.body.username;

  //user.setPassword(req.body.password);
  user.password = req.body.password;

  user.save(function(err) {
    // var token;
    // token = user.generateJwt();
    res.status(200);
    // res.json({
    //   "token" : token
    // });
  });

};

module.exports.login = function(req, res) {
  //TODO
};
