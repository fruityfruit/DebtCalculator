var Zillow = require("node-zillow");
var mongoose = require("mongoose");
var Bls2 = require("bls2");
var User = mongoose.model("User"); //User schema from ../models/user.js
var Opportunity = mongoose.model("Opportunity"); //Opportunity schema from ../models/opportunity.js
const ZILLOW_KEY = "X1-ZWz1gs7bfxtszv_axb7v";
const BLS_KEY = "d5e5ce2edc924a42be0c6c858df8ad53";

/*
  This function gets the Zillow data that we want using the Zillow API call.
  The Zillow call returns a set of average neighborhood prices in the city and state provided.
  We then average those returned averages together.
*/
module.exports.getZillow = function(req , res) {
  Opportunity.findById(req.params.id, function(err, opp) { //finds the opportunity
    if (err) {
      res.status(400).send(err);
    } else if (!opp) {
      res.status(400).send("Unable to find the opportunity");
    } else {
      var zillow = new Zillow(ZILLOW_KEY);
      var parameters = { //parameters for the zillow api call
        childtype: "neighborhood",
        state: opp.state.toLowerCase(),
        city: opp.city.toLowerCase()
      }
      zillow.get("GetRegionChildren", parameters) //makes the zillow call
        .then(function(results) {
          var sum = 0;
          var count = 0;
          results.response.list.region.forEach(function(item, index) { //for each neighborhood average returned
            if (item.zindex !== undefined) {
              item.zindex.forEach(function(item0, index0) { //add the value of each neighborhood to the sum, and increment the counter
                sum = sum + parseInt(item0._, 10);
                count = count + 1;
              });
            }
          });
          if (sum === 0 && count === 0) { //prevents a divide-by-zero condition
            count = 1;
          }
          res.status(200).json({"average": sum/count}); //return the average Zillow data for this city and state
        })
        .catch(err => {
          res.status(400).send(err);
        });
    }
  });
};

/*
  This function gets the BLS data that we want using the BLS API call.
  The BLS call takes a list of regions for which we want cost-of-living data, and returns a figure corresponding to the
  cost of purchasing a slew of common items in that region. We then divide each region's by the value by the value
  for America on average, giving us a multiplier that is more intuitive than the raw data.
*/
module.exports.getBLS = function(req, res) {
  var bls = new Bls2(BLS_KEY);
  var options = { //parameters for the BLS API call
    "seriesid": [],
    "startyear": "2018",
    "endyear": "2018",
    "catalog": false,
    "calculations": false,
    "annualaverage": true
  };
  var query;
  req.body.forEach(function(entry) { //add each region in the request to the API call options
    query = "CUUR"+entry+"SA0";
    options.seriesid.push(query);
  });
  query = "CUUR0000SA0"; //the region code for the average American purchasing power
  options.seriesid.push(query); //add the average American code
  bls.fetch(options).then(function(response) { //actually make the BLS API call
    var baseLine;
    var retVal = [];
    for (entry in options.seriesid) {
      try { //sometimes these return values are undefined, so we use a try-catch block to make the code safer
        if (response.Results.series[entry].seriesID === "CUUR0000SA0") { //this result is the average American result
          baseLine = response.Results.series[entry].data[0].value; //save this "baseline" value
          break;
        }
      } catch(err) {}
    }
    for (entry in options.seriesid) {
      try {
        if (response.Results.series[entry].seriesID !== "CUUR0000SA0") { //for every region that is not the baseline
          //add the following to the array that is being returned:
          //{the region code}: {x, where $1 in the average American town is worth $x in this region}
          retVal.push(response.Results.series[entry].seriesID+": "+(baseLine/response.Results.series[entry].data[0].value));
        }
      } catch(err) {}
    }
    res.status(200).json(retVal); //return the purchasing power of these regions
  }).catch(function(err) {
    console.log(err);
    res.status(400).send(err);
  });
}

/*
  This function gets the chart data that we want to use on the Results page.
*/
module.exports.getCharts = function(req, res) {
  User.
    findOne({ username: req.params.username }). //finds the user
    populate("opportunities").
    populate("debts"). //populates the user's opportunities and debts
    exec(function (err, user) {
      if (err) {
        res.status(400).send(err);
      } else if (!user) {
        res.status(400).send("Unable to find the user");
      } else {
        res.status(200).json({ //return the opportunities and debts of the user
          "opportunities" : user.opportunities,
          "debts" : user.debts
        });
      }
    });
};
