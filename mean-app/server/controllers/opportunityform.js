var mongoose = require('mongoose');
var Form = mongoose.model('Form'); //Form schema from ../models/opportunity.js
var User = mongoose.model('User'); //User schema from ../models/user.js
// This file is responsible for the opportunity form request/respond functions
module.exports.saveForm = function(req, res) {
  var form = new Form();
  form._id = new mongoose.Types.ObjectId();
  form.type = req.body.type; // set type
  form.oppName = req.body.oppName; // set oppName
  form.cityName = req.body.cityName; // set cityName
  form.oppCost = req.body.oppCost; // set oppCost
  form.oppDebt = req.body.oppDebt; // set oppDebt
  form.move = req.body.move;
  console.log("saving form");
  User.findOneAndUpdate({username: req.body.user}, {$push: {opportunities: form._id}}, function (err, user) {
    if (err || !user) {
      res.status(400).send("unable to save to database");
    } else {
      form.user = user._id;
      form.save()// save opportunity to database
      .then(form => {
        console.log("form saved to DB");
        res.status(200).json({'form': 'form added successfully'});
      })
      .catch(err => {
        res.status(400).send("unable to save to database");
      });
    }
  });
};
//This function searches for an opportunity in the database
module.exports.getForms = function(req, res) {
  console.log("in get forms");
  console.log(req.params.user);
  User.
    findOne({username: req.params.user}).
    populate('opportunities').
    exec(function (err, user) {
      if (err || !user) {
        res.status(400);
        if (err) res.send(err);
        else res.send("user not found");
      } else {
        console.log("opportunities");
        console.log(user.opportunities);
        res.status(200).json({'opportunities': user.opportunities});
      }
    });
  };
  //This function edits an opportunity by ID in the database
module.exports.editForm = function(req, res) {
    let id = req.params.id;
    Form.findById(id, function (err, opportunity){
        res.json(opportunity);
    });
    console.log("editForm done now");
  };
  //This function updates an opportunity by ID in the database
module.exports.updateForm = function(req, res) {
    Form.findById(req.params.id, function(err, opportunity) {
    if (!opportunity)
      return next(new Error('Could not load Document'));
    else {
        opportunity.type = req.body.type; // set type
        opportunity.oppName = req.body.oppName; // set oppName
        opportunity.cityName = req.body.cityName; // set cityName
        opportunity.oppCost = req.body.oppCost; // set oppCost
        opportunity.oppDebt = req.body.oppDebt; // set oppDebt
        opportunity.move = req.body.move;
        //opportunity.user = req.body.user;
        opportunity.save().then(opportunity => {
          res.json('Update complete');
      })
      .catch(err => {
            res.status(400).send("Unable to update the database");
      });
   }
  });
};

module.exports.deleteForm = function(req,res) {
    // User.findOne({username: req.params.user}, function(err, user) {
    //   if (err) {
    //     res.json(err);
    //   } else if (!user) {
    //     res.status(400).send("Unable to update the database");
    //   } else {
    //     var opportunities = user.opportunities;
    //     console.log(opportunities);
    //
    //   }
    // })
    console.log(req.params.id);
    User.findOneAndUpdate({username: req.params.user}, {$pull: {opportunities: req.params.id}}, function(err, user) {
      if (err || !user) {
        res.status(400).send("unable to save to database");
      } else {
        console.log(user);
      }
    });
    Form.findByIdAndRemove({_id: req.params.id}, function(err, opportunity) {
    if(err)
      res.json(err);
    else
      res.json('Successfully deleted');
    });
};
