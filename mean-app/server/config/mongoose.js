// Dependencies
const mongoose = require('mongoose');

// Configuring mongoose
module.exports = function(config) {
  mongoose.connect(config.db);
  var db = mongoose.connection;
  db.on('error', function callback() {
    console.log("Connection error!");
  });
  db.once('open', function callback() {
    console.log("Mongo working!");
    var userModel = require('./../../app/models/user.js');
    var a = new userModel({username:'b', password:'c'});
    console.log(a.username);
    a.save();
  });
}
