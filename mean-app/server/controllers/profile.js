var mongoose = require('mongoose');
var User = mongoose.model('User'); //User schema from ../models/user.js
var Debt = mongoose.model('Debt'); //Debt schema from ../models/debt.js

//update the profile of an existing user
module.exports.updateProfile = function(req, res) {
  User.findOne({username: req.body.username}, function(err, user) { //finds the user
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(400).send("unable to find the user");
    } else {
      user.state = req.body.state;
      user.region = req.body.region;
      user.groceries = req.body.groceries;
      user.rent = req.body.rent;
      user.spending = req.body.spending;
      user.savings = req.body.savings;
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
  User.findOne({username: req.params.username}, function(err, user) { //finds the user
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(400).send("unable to find the user");
    } else {
      res.status(200).json(user);
    }
  });
};

//adds a debt to the user's profile
module.exports.createDebt = function(req, res) {
  var debt = new Debt();
  debt._id = new mongoose.Types.ObjectId();
  debt.name = req.body.name;
  debt.principal = req.body.principal;
  debt.rate = req.body.rate;
  debt.annualCompounds = req.body.annualCompounds;
  debt.monthlyPayment = req.body.monthlyPayment;
  //adds the debt to the user
  User.findOneAndUpdate({username: req.body.username}, {$push: {debts: debt._id}}, function(err, user) {
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(400).send("unable to find the user");
    } else {
      debt.user = user._id;
      //save opportunity to database
      debt.save()
        .then(debt => {
          res.status(200).json('debt added successfully');
        })
        .catch(err => {
          res.status(400).send("unable to save debt to database");
        });
    }
  });
};

//returns all of the debts associated with a user profile
module.exports.getDebts = function(req, res) {
  User.
    findOne({username: req.params.username}). //finds the user in question
    populate('debts'). //populates user's debts
    exec(function(err, user) {
      if (err) {
        res.status(400).send(err);
      } else if (!user) {
        res.status(400).send("unable to find the user");
      } else {
        res.status(200).json({'debts': user.debts});
      }
    });
};

//gets one debt for editting purposes
module.exports.editDebt = function(req, res) {
  Debt.findById(req.params.id, function(err, debt) { //finds the debt
    if (err) {
      res.status(400).send(err);
    } else if (!debt) {
      res.status(400).send("unable to find the debt");
    } else {
      res.status(200).json(debt);
    }
  });
};

//saves a previously created debt
module.exports.updateDebt = function(req, res) {
  Debt.findById(req.params.id, function(err, debt) { //finds the debt
    if (err) {
      res.status(400).send(err);
    } else if (!debt) {
      res.status(400).send("unable to find the debt");
    } else {
      debt.name = req.body.name;
      debt.principal = req.body.principal;
      debt.rate = req.body.rate;
      debt.annualCompounds = req.body.annualCompounds;
      debt.monthlyPayment = req.body.monthlyPayment;
      debt.save()
        .then(debt => {
          res.status(200).json('Update complete');
        })
        .catch(err => {
          res.status(400).send("Unable to update the database");
        });
    }
  });
};

//deletes a debt and the entry for it in its corresponding user
module.exports.deleteDebt = function(req, res) {
  //finds the user that owns the debt and removes the debt from that user
  User.findOneAndUpdate({username: req.params.username}, {$pull: {debts: req.params.id}}, function(err, user) {
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(400).send("unable to find the user");
    } else {
      //deletes the debt itself from the database
      Debt.findByIdAndRemove({_id: req.params.id}, function(err, debt) {
        if (err) {
          res.status(400).send(err);
        } else if (!debt) {
          res.status(400).send("unable to find the debt");
        } else {
          res.status(200).json('Successfully deleted');
        }
      });
    }
  });
};
