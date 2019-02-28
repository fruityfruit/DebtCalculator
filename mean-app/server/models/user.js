var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  creation: Number,
  username: {
    type: String,
    required: true,
    unique: true
  },
  salt: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  state: String,
  region: String,
  dependents: Number,
  rent: Number,
  spending: Number,
  pets: Number,
  opportunities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity'
  }],
  debts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Debt'
  }]
},
{
    collection: 'users'
});

userSchema.methods.setPassword = function(password) {
  //sets the password salt and hash in the database, not saving the actual password
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  //returns whether the given password matches the salt and hash stored in the database
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateToken = function() {
  //returns a validated "token" to keep track of whether the user is logged in
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // TODO DO NOT KEEP YOUR SECRET IN THE CODE!
};

// create the mongoose model User for the rest of the app to see
mongoose.model('User', userSchema);
