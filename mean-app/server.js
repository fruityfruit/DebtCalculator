// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

// Bring in the database
require('./server/models/db');

// Bring in the routes for the API
var routesApi = require('./server/routes/routes');

// Create an instance of express
var app = express();

// Logs GET and POST requests in terminal running express
app.use(logger('dev'));
// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist/mean-app')));

// Use the API routes when path starts with /api
app.use('/api', routesApi);

// Redirect all other routes to the index page
app.use(function(req, res, next) {
  res.sendFile(__dirname + '/dist/mean-app/index.html');
});

module.exports = app;
