var Zillow = require('node-zillow');
var mongoose = require('mongoose');
var User = mongoose.model('User'); //User schema from ../models/user.js

//gets the Zillow data that we want using the Zillow API call
module.exports.getZillow = function(req , res) {
  User.
    findOne({username: req.params.user}). //finds the user
    populate('opportunities'). //populates the user's opportunities
    exec(function (err, user) {
      if (err) {
        res.status(400).send(err);
      } else if (!user) {
        res.status(400).send("unable to find the user");
      } else {
        var zillow = new Zillow("zwsid"); // TODO this zwsid should not be listed in the code
        var zillowOutput = [];
        user.opportunities.forEach(function(item, index) {
          var parameters = {
            state: item.stateName,
            city: item.cityName
          };
          //console.log(parameters);
          zillowOutput.push(parameters);
          // zillow.get('GetRegionChildren', parameters).then(function(results) {
          //   console.log(results);
          //   zillowOutput.push(results);
          // });
        });
        // TODO logic to turn zillowOutput into an average home price
        res.status(200).json({'average': 300000});
      }
    });
};

//gets the chart data that we want to use on the Results page
module.exports.getCharts = function(req, res) {
  User.
    findOne({username: req.params.user}). //finds the user
    populate('opportunities'). //populates the user's opportunities
    exec(function (err, user) {
      if (err) {
        res.status(400).send(err);
      } else if (!user) {
        res.status(400).send("unable to find the user");
      } else {
        res.status(200).json({'opportunities': user.opportunities}); // TODO for now, we will return the entire opportunity.
      }
    });
};
