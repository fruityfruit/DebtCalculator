const mongoose = require('mongoose');

// Configuring mongoose
var dbURI = 'mongodb://localhost/debtDB';
if (process.env.NODE_ENV === 'production') {
  dbURI = 'mongodb://debtcalculator:test123@ds111103.mlab.com:11103/debtcalculator';
}
mongoose.connect(dbURI);

// Connection events
mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
});

// App termination / restart events
// To be called when process is restarted or terminated
var gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};
// For nodemon restarts
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function() {
    process.exit(0);
  });
});
// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app termination', function() {
    process.exit(0);
  });
});

// Bring in schemas and models
require('./opportunity');
require('./user');
