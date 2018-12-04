const express = require('express');
const path = require('path');
const router = express.Router();

// Controllers
var ctrlAuth = require('../controllers/authentication'); //authentication
var ctrlOpp = require('../controllers/opportunity'); //opportunity page
var ctrlProfile = require('../controllers/profile'); //profile page
var ctrlResult = require('../controllers/result'); //results page

router.post('/register', ctrlAuth.register);

router.post('/signin', ctrlAuth.signin);

router.get('/opportunity/:user', ctrlOpp.getOpps);

router.get('/edit/:id', ctrlOpp.editOpp);

router.get('/opportunity/delete/:user/:id', ctrlOpp.deleteOpp);

router.post('/opportunity', ctrlOpp.saveOpp);

router.post('/edit/:id', ctrlOpp.updateOpp);

router.get('/personal/:user', ctrlProfile.getProfile);

router.post('/personal', ctrlProfile.updateProfile);

router.get('/zillow/:user', ctrlResult.getZillow);

router.get('/charts/:user', ctrlResult.getCharts)

module.exports = router;
