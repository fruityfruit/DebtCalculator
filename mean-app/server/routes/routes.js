const express = require('express');
const path = require('path');
const router = express.Router();

// Controllers
var ctrlProfile = require('../controllers/profile'); //not currently in use
var ctrlAuth = require('../controllers/authentication'); //file where the actual guts of the POST requests are handled
var ctrlOpp = require('../controllers/opportunityform');
// Post request for registering
router.post('/register', ctrlAuth.register);

// Post request for logging in
router.post('/signin', ctrlAuth.signin);

router.post('/opportunity', ctrlOpp.saveForm);

router.get('/opportunity/:user', ctrlOpp.getForms);

router.get('/edit/:id', ctrlOpp.editForm);

router.post('/edit/:id', ctrlOpp.updateForm);

router.get('/opportunity/delete/:user/:id', ctrlOpp.deleteForm);

// Catch all other routes and return the index file
/*router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/mean-app/index.html'));
});*/

module.exports = router;
