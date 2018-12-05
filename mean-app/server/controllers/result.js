var Zillow = require('node-zillow');
var mongoose = require('mongoose');
var User = mongoose.model('User'); //User schema from ../models/user.js
var Opportunity = mongoose.model('Opportunity'); //Opportunity schema from ../models/opportunity.js

//gets the Zillow data that we want using the Zillow API call
module.exports.getZillow = function(req , res) {
  Opportunity.findById(req.params.id, function(err, opp) { //finds the opportunity
    if (err) {
      res.status(400).send(err);
    } else if (!opp) {
      res.status(400).send("unable to find the opportunity");
    } else {
      var zillow = new Zillow("X1-ZWz1gs7bfxtszv_axb7v"); // TODO this zwsid should not be listed in the code
      var parameters = {
        childtype: 'neighborhood',
        state: opp.stateName,
        city: opp.cityName
      }
      zillow.get('GetRegionChildren', parameters)
        .then(function(results) {
          var sum = 0;
          var count = 0;
          results.response.list.region.forEach(function(item, index) {
            if (item.zindex !== undefined) {
              item.zindex.forEach(function(item0, index0) {
                sum = sum + parseInt(item0._, 10);
                count = count + 1;
              });
            }
          });
          if (sum === 0 && count === 0) { //prevents a divide-by-zero condition
            count = 1;
          }
          res.status(200).json({'average': sum/count});
        })
        .catch(err => {
          res.status(400).send(err);
        });
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
