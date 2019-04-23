var mongoose = require("mongoose");
var User = mongoose.model("User"); //User schema from ../models/user.js
var Debt = mongoose.model("Debt"); //Debt schema from ../models/debt.js

/*
  This function updates the profile of an existing user.
*/
module.exports.updateProfile = function(req, res) {
  User.findOne({ username: req.body.username }, function(err, user) { //finds the user
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(400).send("Unable to find the user");
    } else {
      user.state = req.body.state;
      user.region = req.body.region;
      user.groceries = req.body.groceries;
      user.rent = req.body.rent;
      user.spending = req.body.spending;
      user.savings = req.body.savings;
      user.save() //save user's profile to database
        .then(user => {
          res.status(200).json("User updated successfully");
        })
        .catch(err => {
          res.status(400).send("Unable to save to database");
        });
    }
  });
};

/*
  This function gets the profile data associated with the user.
*/
module.exports.getProfile = function(req, res) {
  User.findOne({ username: req.params.username }, function(err, user) { //finds the user
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(400).send("Unable to find the user");
    } else { //return the entire user schema
      res.status(200).json(user);
    }
  });
};

/*
  This function adds a debt to the user's profile.
*/
module.exports.createDebt = function(req, res) {
  var debt = new Debt(); //create a new instance of the debt schema
  debt._id = new mongoose.Types.ObjectId();
  debt.name = req.body.name;
  debt.principal = req.body.principal;
  debt.rate = req.body.rate;
  debt.annualCompounds = req.body.annualCompounds;
  debt.monthlyPayment = req.body.monthlyPayment;
  debt.opportunity = req.body.opportunity;
  //adds the debt to the user in the database
  User.findOneAndUpdate({ username: req.body.username }, { $push: { debts: debt._id } }, function(err, user) {
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(400).send("Unable to find the user");
    } else {
      debt.user = user._id;
      debt.save() //saves the debt to database
        .then(debt => {
          res.status(200).json("Debt added successfully");
        })
        .catch(err => {
          res.status(400).send("Unable to save debt to database");
        });
    }
  });
};

/*
  This function returns all of the debts associated with a user's profile.
*/
module.exports.getDebts = function(req, res) {
  User.
    findOne({ username: req.params.username }). //finds the user
    populate("debts"). //populates the user's debts
    exec(function(err, user) {
      if (err) {
        res.status(400).send(err);
      } else if (!user) {
        res.status(400).send("Unable to find the user");
      } else { //return the user's debts
        res.status(200).json({"debts": user.debts});
      }
    });
};

/*
  This function gets one specific debt for editing purposes.
*/
module.exports.editDebt = function(req, res) {
  Debt.findById(req.params.id, function(err, debt) { //finds the debt
    if (err) {
      res.status(400).send(err);
    } else if (!debt) {
      res.status(400).send("Unable to find the debt");
    } else { //returns the debt
      res.status(200).json(debt);
    }
  });
};

/*
  This function updates a previously created debt.
*/
module.exports.updateDebt = function(req, res) {
  Debt.findById(req.params.id, function(err, debt) { //finds the debt
    if (err) {
      res.status(400).send(err);
    } else if (!debt) {
      res.status(400).send("Unable to find the debt");
    } else {
      debt.name = req.body.name;
      debt.principal = req.body.principal;
      debt.rate = req.body.rate;
      debt.annualCompounds = req.body.annualCompounds;
      debt.monthlyPayment = req.body.monthlyPayment;
      debt.opportunity = req.body.opportunity;
      debt.save() //saves the debt to the database
        .then(debt => {
          res.status(200).json("Update complete");
        })
        .catch(err => {
          res.status(400).send("Unable to update the database");
        });
    }
  });
};

/*
This function deletes both a debt instance and the reference to that debt in the user that owns it.
The reference is deleted first, then the unattached debt is removed.
*/
module.exports.deleteDebt = function(req, res) {
  //finds the user that owns the debt and removes the debt from them
  User.findOneAndUpdate({ username: req.params.username }, { $pull: { debts: req.params.id } }, function(err, user) {
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(400).send("Unable to find the user");
    } else {
      Debt.findByIdAndRemove({ _id: req.params.id }, function(err, debt) { //deletes the debt itself from the database
        if (err) {
          res.status(400).send(err);
        } else if (!debt) {
          res.status(400).send("Unable to find the debt");
        } else {
          res.status(200).json("Successfully deleted");
        }
      });
    }
  });
};
