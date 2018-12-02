var mongoose = require('mongoose');
var Form = mongoose.model('Form'); //User schema from ../models/opportunity.js
// This file is responsible for the opportunity form request/respond functions
module.exports.saveForm = function(req, res) {
  var form = new Form();
  form.type = req.body.type; // set type
  form.oppName = req.body.oppName; // set oppName
  form.cityName = req.body.cityName; // set cityName
  form.oppCost = req.body.oppCost; // set oppCost
  form.oppDebt = req.body.oppDebt; // set oppDebt
  form.move = req.body.move; //set move
  form.save()// save opportunity to database
  .then(form => {
    res.status(200).json({'form': 'form added successfully'});
  })
  .catch(err => {
  res.status(400).send("unable to save to database");
  });
};
//This function searches for an opportunity in the database
module.exports.getForms = function(req, res) {
  Form.find(function (err, opportunity){
      if(err){
        console.log(err);
      }
      else {
        res.json(opportunity);
      }
    });
  };
  //This function edits an opportunity by ID in the database
module.exports.editForm = function(req, res) {
    let id = req.params.id;
    Form.findById(id, function (err, opportunity){
        res.json(opportunity);
    });
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
        opportunity.save().then(opportunity => {
          res.json('Update complete');
      })
      .catch(err => {
            res.status(400).send("Unable to update the database");
      });
   }
  });
};

module.exports.deleteForm = function(req,res) { //This function deletes an opportunity based on id
    Form.findByIdAndRemove({_id: req.params.id}, function(err, opportunity) {
    if(err)
      res.json(err);
    else
      res.json('Successfully deleted');
    });
};
