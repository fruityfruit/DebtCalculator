var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.updateProfile = function(req, res) {
  User.findOne({username: req.body.username},
    function(err, user) {
      if (err || !user) {
        res.status(400).send("unable to save to database");
      } else {
        user.income = req.body.income;
        user.debt = req.body.debt;
        user.interest = req.body.interest;
        user.payments = req.body.payments;
        user.dependents = req.body.dependents;
        user.rent = req.body.rent;
        user.spending = req.body.spending;
        user.pets = req.body.pets;
        user.smoking = req.body.smoking;
        user.drinking = req.body.drinking;
        user.save().then(user => {
          res.json('Update complete');
        })
        res.status(200).json({'user' : 'user updated successfully'});
      }
    });
};

module.exports.getProfile = function(req, res){
  User.findOne({username: req.params.user}, function(err, user){
    if (err || !user) {
      res.status(400).send("unable get user");
    }
    else
    {
      res.json(user);
    }
  });
};
