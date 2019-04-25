const express = require("express");
const path = require("path");
const router = express.Router();

// Controllers
var ctrlAuth = require("../controllers/authentication"); //authentication
var ctrlOpp = require("../controllers/opportunity"); //opportunity page
var ctrlProfile = require("../controllers/profile"); //profile and debt pages
var ctrlResult = require("../controllers/result"); //results page

router.post("/register", ctrlAuth.register);

router.post("/signin", ctrlAuth.signin);

router.post("/username", ctrlAuth.updateUsername);

router.post("/password", ctrlAuth.updatePassword);

router.post("/delete", ctrlAuth.deleteUser);

router.post("/opportunity", ctrlOpp.createOpp);

router.get("/opportunity/:username", ctrlOpp.getOpps);

router.get("/opportunity/short/:username", ctrlOpp.getShortOpps);

router.get("/opportunity/edit/:id", ctrlOpp.editOpp);

router.post("/opportunity/edit/:id", ctrlOpp.updateOpp);

router.get("/opportunity/delete/:username/:id", ctrlOpp.deleteOpp);

router.post("/profile", ctrlProfile.updateProfile);

router.get("/profile/:username", ctrlProfile.getProfile);

router.post("/debt", ctrlProfile.createDebt);

router.get("/debt/:username", ctrlProfile.getDebts);

router.get("/debt/edit/:id", ctrlProfile.editDebt);

router.post("/debt/edit/:id", ctrlProfile.updateDebt);

router.get("/debt/delete/:username/:id", ctrlProfile.deleteDebt);

router.get("/zillow/:id", ctrlResult.getZillow);

router.get("/charts/:username", ctrlResult.getCharts);

router.post("/bls", ctrlResult.getBLS);

module.exports = router;
