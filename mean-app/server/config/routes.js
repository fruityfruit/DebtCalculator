// Dependencies
var routes = require('./../routes/routes.js');

module.exports = function(app) {
  // Tell the app to use the routes defined in the routes file
  app.use('/api', routes);
}
