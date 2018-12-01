const express = require('express');
const path = require('path');
const router = express.Router();

// Controllers
var ctrlProfile = require('../controllers/profile'); //not currently in use
var ctrlAuth = require('../controllers/authentication'); //file where the actual guts of the POST requests are handled

// Post request for registering
router.post('/register', ctrlAuth.register);

// Post request for logging in
router.post('/signin', ctrlAuth.signin);

// Catch all other routes and return the index file
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/mean-app/index.html'));
});

module.exports = router;
