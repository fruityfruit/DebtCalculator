var Zillow = require('node-zillow');
var mongoose = require('mongoose');
//var Form = mongoose.model('Form'); //Form schema from ../models/opportunity.js
var User = mongoose.model('User'); //User schema from ../models/user.js

module.exports.getZillow = function(req , res) {
  // console.log("in get charts");
  // console.log(req.params.user);
  User.
    findOne({username: req.params.user}).
    populate('opportunities').
    exec(function (err, user) {
      if (err || !user) {
        res.status(400);
        if (err) res.send(err);
        else res.send("user not found");
      } else {
        var zillow = new Zillow("zwsid"); //this zwsid should not be listed in the code
        // console.log("opportunities");
        // console.log(user.opportunities);
        var zillowOutput = [];
        user.opportunities.forEach(function(item, index) {
          var parameters = {
            //state: item.state,
            city: item.cityName
            //index: index
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

module.exports.getCharts = function(req, res) {
  // console.log("in get charts");
  // console.log(req.params.user);
  User.
    findOne({username: req.params.user}).
    populate('opportunities').
    exec(function (err, user) {
      if (err || !user) {
        res.status(400);
        if (err) res.send(err);
        else res.send("user not found");
      } else {
        // console.log("opportunities");
        // console.log(user.opportunities);
        res.status(200).json({'opportunities': user.opportunities}); // for now, we will return the entire opportunity. This will change later to increase efficiency.
      }
    });
};
