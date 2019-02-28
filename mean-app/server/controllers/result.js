var Zillow = require('node-zillow');
var mongoose = require('mongoose');
var Bls2 = require('bls2');
var User = mongoose.model('User'); //User schema from ../models/user.js
var Opportunity = mongoose.model('Opportunity'); //Opportunity schema from ../models/opportunity.js
const ZILLOW_KEY = "X1-ZWz1gs7bfxtszv_axb7v";
const BLS_KEY = "d5e5ce2edc924a42be0c6c858df8ad53";

//gets the Zillow data that we want using the Zillow API call
module.exports.getZillow = function(req , res) {
  Opportunity.findById(req.params.id, function(err, opp) { //finds the opportunity
    if (err) {
      res.status(400).send(err);
    } else if (!opp) {
      res.status(400).send("unable to find the opportunity");
    } else {
      var zillow = new Zillow(ZILLOW_KEY);
      var parameters = {
        childtype: 'neighborhood',
        state: opp.state.toLowerCase(),
        city: opp.city.toLowerCase()
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

//gets the BLS data that we want using the BLS API call
module.exports.getBLS = function(req, res) {
  var bls = new Bls2(BLS_KEY);
  var options = {
    'seriesid': [],
    'startyear': '2018',
    'endyear': '2018',
    'catalog': false,
    'calculations': false,
    'annualaverage': true
  };
  var query;
  req.body.forEach(function(entry) {
    query = 'CUUR'+entry+'SA0';
    options.seriesid.push(query);
  });
  query = 'CUUR0000SA0';
  options.seriesid.push(query);
  bls.fetch(options).then(function(response) {
    var retVal = [];
    for (entry in options.seriesid) {
      try {
        retVal.push(response.Results.series[entry].seriesID+": "+response.Results.series[entry].data[0].value);
      } catch(err) {
      }
    }
    res.status(200).json(retVal);
  }).catch(function(err) {
    console.log(err);
    res.status(400).send(err);
  });
}

//gets the chart data that we want to use on the Results page
module.exports.getCharts = function(req, res) {
  User.
    findOne({username: req.params.username}). //finds the user
    populate('opportunities').
    populate('debts'). //populates the user's opportunities and debts
    exec(function (err, user) {
      if (err) {
        res.status(400).send(err);
      } else if (!user) {
        res.status(400).send("unable to find the user");
      } else {
        console.log(user.opportunities);
        console.log(user.debts);
        res.status(200).json({
          'opportunities' : user.opportunities,
          'debts' : user.debts
        }); // TODO for now, we will return all of the data
      }
    });
};
