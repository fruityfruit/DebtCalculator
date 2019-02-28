var mongoose = require('mongoose');
var Opportunity = mongoose.model('Opportunity'); //Opportunity schema from ../models/opportunity.js
var User = mongoose.model('User'); //User schema from ../models/user.js

//save a new opportunity to the database
module.exports.createOpp = function(req, res) {
  var opp = new Opportunity();
  opp._id = new mongoose.Types.ObjectId();
  opp.type = req.body.type;
  opp.name = req.body.name;
  opp.state = req.body.state;
  opp.city = req.body.city;
  opp.region = req.body.region;
  opp.income = req.body.income;
  opp.move = req.body.move;
  opp.principal = req.body.principal;
  opp.rate = req.body.rate;
  opp.annualCompounds = req.body.annualCompounds;
  opp.monthlyPayment = req.body.monthlyPayment;
  //adds the opportunity to the user
  User.findOneAndUpdate({username: req.body.username}, {$push: {opportunities: opp._id}}, function(err, user) {
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(400).send("unable to find the user");
    } else {
      opp.user = user._id;
      //save opportunity to database
      opp.save()
        .then(opp => {
          res.status(200).json('opportunity added successfully');
        })
        .catch(err => {
          res.status(400).send("unable to save opportunity to database");
        });
    }
  });
};

//get opportunities from the database for a user
module.exports.getOpps = function(req, res) {
  User.
    findOne({username: req.params.username}). //finds the user in question
    populate('opportunities'). //populates his/her opportunities
    exec(function(err, user) {
      if (err) {
        res.status(400).send(err);
      } else if (!user) {
        res.status(400).send("unable to find the user");
      } else {
        res.status(200).json({'opportunities': user.opportunities});
      }
    });
};

//gets a specific opportunity for editting purposes
module.exports.editOpp = function(req, res) {
  Opportunity.findById(req.params.id, function(err, opp) { //finds the opportunity
    if (err) {
      res.status(400).send(err);
    } else if (!opp) {
      res.status(400).send("unable to find the opportunity");
    } else {
      res.status(200).json(opp);
    }
  });
};

//updates an opportunity that is already in the database
module.exports.updateOpp = function(req, res) {
  Opportunity.findById(req.params.id, function(err, opp) { //finds the opportunity
    if (err) {
      res.status(400).send(err);
    } else if (!opp) {
      res.status(400).send("unable to find the opportunity");
    } else {
      opp.type = req.body.type;
      opp.name = req.body.name;
      opp.state = req.body.state;
      opp.city = req.body.city;
      opp.region = req.body.region;
      opp.income = req.body.income;
      opp.move = req.body.move;
      opp.principal = req.body.principal;
      opp.rate = req.body.rate;
      opp.annualCompounds = req.body.annualCompounds;
      opp.monthlyPayment = req.body.monthlyPayment;
      opp.save()
        .then(opp => {
          res.status(200).json('Update complete');
        })
        .catch(err => {
          res.status(400).send("Unable to update the database");
        });
    }
  });
};

//deletes an opportunity and the reference to it in the user that owns it
module.exports.deleteOpp = function(req, res) {
  //finds the user that owns the opportunity and removes the opportunity from him/her
  User.findOneAndUpdate({username: req.params.username}, {$pull: {opportunities: req.params.id}}, function(err, user) {
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(400).send("unable to find the user");
    } else {
      //deletes the opportunity itself from the database
      Opportunity.findByIdAndRemove({_id: req.params.id}, function(err, opp) {
        if (err) {
          res.status(400).send(err);
        } else if (!opp) {
          res.status(400).send("unable to find the opportunity");
        } else {
          res.status(200).json('Successfully deleted');
        }
      });
    }
  });
};
