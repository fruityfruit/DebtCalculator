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
