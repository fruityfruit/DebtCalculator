var mongoose = require("mongoose");
var Opportunity = mongoose.model("Opportunity"); //Opportunity schema from ../models/opportunity.js
var User = mongoose.model("User"); //User schema from ../models/user.js

/*
  This function creates a new instance of the Opportunity schema and attaches it to a specific user.
*/
module.exports.createOpp = function(req, res) {
  var opp = new Opportunity(); //create a new opportunity
  opp._id = new mongoose.Types.ObjectId();
  opp.type = req.body.type;
  opp.name = req.body.name;
  opp.state = req.body.state;
  opp.city = req.body.city;
  opp.region = req.body.region;
  opp.income = req.body.income;
  opp.bonus = req.body.bonus;
  opp.move = req.body.move;
  //adds the opportunity to the user in the database
  User.findOneAndUpdate({ username: req.body.username }, { $push: { opportunities: opp._id } }, function(err, user) {
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(400).send("Unable to find the user");
    } else {
      opp.user = user._id; //this allows the user's opportunities to be easily populated in later functions
      opp.save() //saves the opportunity to database
        .then(opp => {
          res.status(200).json("Opportunity added successfully");
        })
        .catch(err => {
          res.status(400).send("Unable to save opportunity to database");
        });
    }
  });
};

/*
  This function gets all of the opportunities for a specific user from the database.
*/
module.exports.getOpps = function(req, res) {
  User.
    findOne({ username: req.params.username }). //finds the user
    populate("opportunities"). //populates their opportunities
    exec(function(err, user) {
      if (err) {
        res.status(400).send(err);
      } else if (!user) {
        res.status(400).send("Unable to find the user");
      } else { //returns all of the opportunities previously populated
        res.status(200).json({"opportunities": user.opportunities});
      }
    });
};

/*
  This function gets the name and _id of the opportunities for a specific user from the database.
  In some circumstances, this is all the data we need, and we don't want to return more data than we plan to use.
*/
module.exports.getShortOpps = function(req, res) {
  User.
    findOne({ username: req.params.username }). //finds the user
    populate("opportunities"). //populates their opportunities
    exec(function(err, user) {
      if (err) {
        res.status(400).send(err);
      } else if (!user) {
        res.status(400).send("Unable to find the user");
      } else {
        var shortOpps = [];
        for (var i = 0; i < user.opportunities.length; ++i) { //for each opportunity previously populated
          var opp = { //create a new object that just contains the _id and name
            _id:user.opportunities[i]._id,
            name:user.opportunities[i].name
          };
          shortOpps.push(opp); //add that new object to the array of things to be returned
        }
        res.status(200).json({"opportunities": shortOpps}); //return the array of shortened opportunities
      }
    });
};

/*
  This function gets one specific opportunity for editing purposes.
*/
module.exports.editOpp = function(req, res) {
  Opportunity.findById(req.params.id, function(err, opp) { //finds the opportunity
    if (err) {
      res.status(400).send(err);
    } else if (!opp) {
      res.status(400).send("Unable to find the opportunity");
    } else { //returns the opportunity
      res.status(200).json(opp);
    }
  });
};

/*
  This function updates an opportunity that is already in the database.
*/
module.exports.updateOpp = function(req, res) {
  Opportunity.findById(req.params.id, function(err, opp) { //finds the opportunity
    if (err) {
      res.status(400).send(err);
    } else if (!opp) {
      res.status(400).send("Unable to find the opportunity");
    } else {
      opp.type = req.body.type;
      opp.name = req.body.name;
      opp.state = req.body.state;
      opp.city = req.body.city;
      opp.region = req.body.region;
      opp.income = req.body.income;
      opp.bonus = req.body.bonus;
      opp.move = req.body.move;
      opp.save() //saves the opportunity to database
        .then(opp => {
          res.status(200).json("Update complete");
        })
        .catch(err => {
          res.status(400).send("Unable to update the database");
        });
    }
  });
};

/*
  This function deletes both an opportunity instance and the reference to that opportunity in the user that owns it.
  The reference is deleted first, then the unattached opportunity is removed.
*/
module.exports.deleteOpp = function(req, res) {
  //finds the user that owns the opportunity and removes the opportunity from them
  User.findOneAndUpdate({ username: req.params.username }, { $pull: { opportunities: req.params.id } }, function(err, user) {
    if (err) {
      res.status(400).send(err);
    } else if (!user) {
      res.status(400).send("Unable to find the user");
    } else {
      Opportunity.findByIdAndRemove({ _id: req.params.id }, function(err, opp) { //deletes the opportunity itself from the database
        if (err) {
          res.status(400).send(err);
        } else if (!opp) {
          res.status(400).send("Unable to find the opportunity");
        } else {
          res.status(200).json("Successfully deleted");
        }
      });
    }
  });
};
