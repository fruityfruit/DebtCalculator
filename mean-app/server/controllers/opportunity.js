var mongoose = require('mongoose');
var Opportunity = mongoose.model('Opportunity'); //Opportunity schema from ../models/opportunity.js
var User = mongoose.model('User'); //User schema from ../models/user.js

module.exports.saveOpp = function(req, res) {
  var opp = new Opportunity();
  opp._id = new mongoose.Types.ObjectId();
  opp.type = req.body.type;
  opp.oppName = req.body.oppName;
  opp.cityName = req.body.cityName;
  opp.stateName = req.body.stateName;
  opp.oppCost = req.body.oppCost;
  opp.oppDebt = req.body.oppDebt;
  opp.move = req.body.move;
  User.findOneAndUpdate({username: req.body.user}, {$push: {opportunities: opp._id}}, function (err, user) { //associate opportunity with user
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(400).send("unable to save to database");
    } else {
      opp.user = user._id;
      opp.save() //save opportunity to database
        .then(opp => {
          res.status(200).json({'opportunity': 'opportunity added successfully'});
        })
        .catch(err => {
          res.status(400).send("unable to save to database");
        });
    }
  });
};

module.exports.getOpps = function(req, res) {
  User.
    findOne({username: req.params.user}).
    populate('opportunities').
    exec(function (err, user) {
      if (err) {
        res.status(400).send(err);
      } else if (!user) {
        res.status(400).send("unable to save to database");
      } else {
        res.status(200).json({'opportunities': user.opportunities});
      }
    });
  };

module.exports.editOpp = function(req, res) {
  var id = req.params.id;
  Opportunity.findById(id, function (err, opportunity) {
    res.json(opportunity);
  });
};

module.exports.updateOpp = function(req, res) {
  Opportunity.findById(req.params.id, function(err, opp) {
    if (!opp) {
      return next(new Error('Could not load Document'));
    } else {
      opp.type = req.body.type;
      opp.oppName = req.body.oppName;
      opp.cityName = req.body.cityName;
      opp.stateName = req.body.stateName;
      opp.oppCost = req.body.oppCost;
      opp.oppDebt = req.body.oppDebt;
      opp.move = req.body.move;
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

module.exports.deleteOpp = function(req,res) {
  User.findOneAndUpdate({username: req.params.user}, {$pull: {opportunities: req.params.id}}, function(err, user) {
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(400).send("unable to delete from database");
    } else {
      Opportunity.findByIdAndRemove({_id: req.params.id}, function(err, opportunity) {
        if (err) {
          res.status(400).send(err);
        } else if (!opportunity) {
          res.status(400).send("unable to delete from database");
        } else {
          res.status(200).json('Successfully deleted');
        }
      });
    }
  });
};
