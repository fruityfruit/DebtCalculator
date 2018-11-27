// Dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

module.exports = function(app, config) {
  // Parsers for POST data
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  // Point static path to dist
  app.use(express.static(path.join(__dirname, 'dist/mean-app')));
}
