const express = require('express');
const router = express.Router();

const Bid = require('../models/Bid');
const Property = require('../models/Property');
const User = require('../models/user');

// ROUTE all routes beginning with '/bids'

// :id == propertyId
router.get('/:id', (req, res) => {
  let id = req.params.id;
  Bid.getBidsByPropertyId(id)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// :id == propertyId
router.post('/:id', (req, res) => {

});

router.put('/openauction', (req, res) => {
  let propertyId = req.body.propertyId;
  let deadline = req.body.deadline;
  Bid.establishAuction(propertyId, deadline)
    .then((response) => {
      return response;
    })
    .then((response) => {
      return Property.establishAuction(propertyId);
    })
    .then((response) => {
      if (response.success) {
        res.status(201).json(response);
      } else {
        res.status(500).json(response);
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    })
});

module.exports = router;