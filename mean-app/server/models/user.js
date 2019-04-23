var mongoose = require("mongoose");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");

var userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  timeOfCreation: Number,
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
  groceries: Number,
  rent: Number,
  spending: Number,
  savings: Number,
  opportunities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Opportunity"
  }],
  debts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Debt"
  }]
},
{
    collection: "users"
});

/*
  This function sets the password salt and hash in the database.
  We are choosing not to save the actual password. This way, if our database gets compromised,
  we will not reveal our users' private data.
  This function uses the crpyto package to encrypt the data.
*/
userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
};

/*
  This function determines whether the given password matches the salt and hash stored in the database.
  This function uses the crypto package to encrypt the input to see whether it matches our saved data.
*/
userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
  return this.hash === hash;
};

/*
  This function returns a validated "token" to keep track of whether the user is logged in.
*/
userSchema.methods.generateToken = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return jwt.sign({ //this uses the jsonwebtoken package to create our tokens
    _id: this._id,
    username: this.username,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET");
};

//export the mongoose model User for the rest of the app to see
mongoose.model("User", userSchema);
