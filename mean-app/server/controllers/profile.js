var mongoose = require('mongoose');
var User = mongoose.model('User'); //User schema from ../models/user.js

//update the profile of an existing user
module.exports.updateProfile = function(req, res) {
  User.findOne({username: req.body.username}, function(err, user) { //finds the user
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(400).send("unable to find the user");
    } else {
      user.income = req.body.income;
      user.debt = req.body.debt;
      user.interest = req.body.interest;
      user.payments = req.body.payments;
      user.dependents = req.body.dependents;
      user.rent = req.body.rent;
      user.spending = req.body.spending;
      user.pets = req.body.pets;
      user.smoking = req.body.smoking;
      user.drinking = req.body.drinking;
      user.save() //save user's profile to database
        .then(user => {
          res.status(200).json('user updated successfully');
        })
        .catch(err => {
          res.status(400).send("unable to save to database");
        });
    }
  });
};

//gets the profile data associated with the user
module.exports.getProfile = function(req, res) {
  User.findOne({username: req.params.user}, function(err, user) { //finds the user
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(400).send("unable to find the user");
    } else {
      res.status(200).json(user);
    }
  });
};
