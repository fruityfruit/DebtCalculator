// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');

// Configure environment
const env = 'development';
const config = require('./server/config/config.js')[env]; // config exports an array, we are indexing the [env] element

// Create an instance of express
var app = express();

// Configure modules
require('./server/config/express.js')(app, config); // Configure express
require('./server/config/mongoose.js')(config); // Configure mongoose
require('./server/config/routes.js')(app); // Configure routes

// Connect database TODO feels unnecessary
// mongoose.connect(config.db);
// var db = mongoose.connection;

// Create HTTP server
const server = http.createServer(app);

// Listen on the port specified in config
server.listen(config.port, () => console.log(`API running on localhost:${config.port}`));
