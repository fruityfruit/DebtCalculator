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
  form.save(function(err) { // save user to database
    if (!err) { // everything is good
      res.status(200).json({
      });
    } else { // everything is not good
      res.status(400).json(err); // return the error
    }
  });
};
