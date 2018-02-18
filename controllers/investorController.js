const express = require('express');
const router = express.Router();

// Add models
const wholesaler = require('../models/wholesaler');
const investor = require('../models/investor');
const property = require('../models/property');

// GET HTTP to /investor
router.get('/', (req,res) => {
  investor.getAllInvestors((err, investor) => {
    if (err) {
      res.json({
        success: false,
        message: "Failed to load all lists. Error: " + err
      });
    } else {
      res.json({
        success: true,
        message: "Successfully grabbed all investors",
        investors: investor
      });
    }
  });
});

// POST HTTP to register a new investor
router.post('/register', (req, res) => {
  investor.registerInvestor(req.body, (error, response) => {
    if (error) {
      res.status(500).json(response);
    } else {
      res.status(201).json(response);
    }
  });
});

// GET HTTP for /investor for a single investor
router.get('/:uid', (req, res) => {
  investor.getInvestorById(req.params.uid, (err, i) => {
    if (err) {
      res.json({
        success: false,
        message: "Failed to find a investor. Error: " + err
      });
    } else {
      res.json({
        success: true,
        message: "Found investor by id.",
        investor: i
      });
    }
  });
});

// POST HTTP to /investor/inviteinvestor
router.post('/inviteinvestor', (req, res, next) => {
  var newInvestor = new investor({
    userType: req.body.userType,
    userName: req.body.firstName + req.body.lastName,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    wholesalers: []
  });
  newInvestor.wholesalers[0] = req.body.wholesaler;
  investor.inviteInvestor(newInvestor, (err, investor) => {
    if (err) {
      res.json({
        success: false,
        message: "Failed to add a new investor.",
        error: err
      });
    } else {
      res.json({
        success: true,
        message: "Added new investor successfully.",
        investor: investor
      });
    }
  });
});

// GET HTTP for sold properties
router.get('/sold', (req, res, next) => {
  res.send("GET for sold properties")
});

// DELETE HTTP request for deleting a property
router.delete('/:id', (req, res, next) => {
  // access the parameter which is the id of the item to be deleted
  let id = req.params.id;
  // call the model method deletePropertyById
  property.deletePropertyById(id, (err, property) => {
    if (err) {
      res.json({
        success: false,
        message: "Failed to delete property. Error: " + err
      });
    } else if (property) {
      res.json({
        success: true,
        message: "Property deleted successfully."
      });
    } else {
      res.json({
        success: false
      });
    }
  });
});

module.exports = router;