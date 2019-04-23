var mongoose = require("mongoose");
var User = mongoose.model("User"); //User schema from ../models/user.js
var Debt = mongoose.model("Debt"); //Debt schema from ../models/debt.js
var Opportunity = mongoose.model("Opportunity"); //Opportunity schema from ../models/opportunity.js

/*
  This function creates a new instance of the User schema.
  If a username and password are provided, they are used.
  If a username is not provided, a random-like dummy string is used instead. It can be changed by the user later.
*/
module.exports.register = function(req, res) {
  var user = new User(); //create a new user
  user._id = new mongoose.Types.ObjectId();
  user.timeOfCreation = Date.now();
  if (req.body.username === "") {
    //no username was provided, so we will find the next available dummy username in the system
    //We needed a string that would be an unlikely choice for a username, so we chose the following:
    const dummyString = "dlcptwfcmc"; //the initials of the five members of this team.
    User.find({ username: /dlcptwfcmc/i }, "username", function (err, usernames) { //finds all users with non-permanent usernames
      if (err) {
        res.status(400).json(err);
      } else if (usernames) {
        var shouldBreakLoop = false;
        var counter = 0;
        while (!shouldBreakLoop) {
          shouldBreakLoop = true;
          for (var index in usernames) { //for each of the usernames with non-permanent usernames
            if (usernames[index].username === (dummyString + "_" + counter)) { //"dlcptwfcmc_{counter}" is taken, so we should continue
              shouldBreakLoop = false;
              break;
            }
          }
          if (shouldBreakLoop) { //"dlcptwfcmc_{counter}" is not taken, so we assign it to the newly created user
            user.username = dummyString + "_" + counter;
            break;
          } else { //increment counter and continue searching
            counter = counter + 1;
          }
        }
      }
      user.setPassword(req.body.password); //calls a function in the User schema that properly hashes and stores the password
      user.save() //saves the user to database
        .then(user => {
          res.status(200).json({ //since the user is not really logged in because they have not created an account, we do not send a valid token
            "username" : user.username
          });
        })
        .catch(err => {
          res.status(400).json(err);
        });
    });
  } else { //a username was provided, so we use it
    user.username = req.body.username;
    user.setPassword(req.body.password); //calls a function in the User schema that properly hashes and stores the password
    user.save() //saves the user to database
      .then(user => {
        var token;
        token = user.generateToken(); //since the user has created an account and logged in, we send a valid token in response
        res.status(200).json({
          "token" : token,
          "username" : user.username
        });
      })
      .catch(err => {
        res.status(400).json(err);
      });
  }
};

/*
  This function logs in a user that has already created an account.
*/
module.exports.signin = function(req, res) {
  User.findOne({ username: req.body.username }, function (err, user) { //finds the user based on their username
    if (err) {
      res.status(400).json(err);
    } else if (!user || !user.validPassword(req.body.password)) { //the username doesn't exist or the password is wrong
      res.status(401).json({"message": "Username or password incorrect"});
    } else { //the user is logged in, so we return a token and the username of the user
      var token;
      token = user.generateToken();
      res.status(200).json({
        "token": token,
        "username" : user.username
      });
    }
  });
};

/*
  This function updates a user's username in the database.
*/
module.exports.updateUsername = function(req, res) {
  User.findOne({ username: req.body.oldUsername }, function (err, user) { //finds the user based on their old (current) username
    if (err) {
      res.status(400).json(err);
    } else if (!user || !user.validPassword(req.body.password)) { //the old (current) username doesn't exist or the password is wrong
      res.status(401).json({"message": "Password is incorrect"});
    } else {
      user.username = req.body.newUsername; //the new username becomes the current username
      user.save() //saves the user to database
        .then(user => {
          var token;
          token = user.generateToken();
          res.status(200).json({ //the user is re-logged in since they just entered their password, so we return a new token and the username of the user
            "token" : token,
            "username" : user.username
          });
        })
        .catch(err => {
          res.status(400).json(err);
        });
    }
  });
};

/*
  This function updates a user's password in the database.
*/
module.exports.updatePassword = function(req, res) {
  User.findOne({ username: req.body.username }, function (err, user) { //finds the user
    if (err) {
      res.status(400).json(err);
    } else if (!user || !user.validPassword(req.body.oldPassword)) { //the username doesn't exist or the old (current) password is wrong
      res.status(401).json({"message": "Old password is incorrect"});
    } else {
      user.setPassword(req.body.newPassword); //the new password becomes the current password
      user.save() //saves the user to database
        .then(user => {
          var token;
          token = user.generateToken();
          res.status(200).json({ //the user is re-logged in since they just entered their password, so we return a new token and the username of the user
            "token" : token,
            "username" : user.username
          });
        })
        .catch(err => {
          res.status(400).json(err);
        });
    }
  });
};

/*
  This function deletes a user from the database.
  First the user's debts and opportunities are deleted, then their user profile.
*/
module.exports.deleteUser = function(req, res) {
  User.findOne({ username: req.body.username }, function (err, user) { //finds the user
    if (err) {
      res.status(400).json(err);
    } else if (!user || !user.validPassword(req.body.password)) { //the username doesn't exist or the password is wrong
      res.status(401).json({"message": "Password is incorrect"});
    } else {
      user.debts.forEach(function(entry) {
        Debt.findByIdAndRemove({ _id: entry }, function (err, doc) { //delete each of the user's debts
          if (err) {
            res.status(400).json(err);
          }
        });
      });
      user.opportunities.forEach(function(entry) {
        Opportunity.findByIdAndRemove({ _id: entry }, function (err, doc) { //delete each of the user's opportunities
          if (err) {
            res.status(400).json(err);
          }
        });
      });
      User.deleteOne({ username: req.body.username }, function (err) { //delete the user
        if (err) {
          res.status(400).json(err);
        }
        res.status(200).json("Successfully deleted"); //return a 200 status when completed
      });
    }
  });
}
