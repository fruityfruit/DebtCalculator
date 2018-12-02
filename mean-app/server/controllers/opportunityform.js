var mongoose = require('mongoose');
var Form = mongoose.model('Form'); //User schema from ../models/opportunity.js

module.exports.saveForm = function(req, res) {
  var form = new Form();
  form.type = req.body.type; // set type
  form.oppName = req.body.oppName; // set oppName
  form.cityName = req.body.cityName; // set cityName
  form.oppCost = req.body.oppCost; // set oppCost
  form.oppDebt = req.body.oppDebt; // set oppDebt
  form.move = req.body.move;
  form.save()// save opportunity to database
  .then(form => {
    res.status(200).json({'form': 'form added successfully'});
  })
  .catch(err => {
  res.status(400).send("unable to save to database");
  });
};

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

module.exports.editForm = function(req, res) {
    let id = req.params.id;
    Form.findById(id, function (err, opportunity){
        res.json(opportunity);
    });
  };

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
}
