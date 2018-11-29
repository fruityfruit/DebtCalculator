var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.dlandrum = function(req, res) { //TODO
  console.log("dlandrum method touched");
  res.status(401).json({
    "message" : "fuck you"
  });
}
