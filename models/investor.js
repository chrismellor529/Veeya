// Require mongoose package
const mongoose = require('mongoose');
require('mongoose-type-email');
const config = require('../config/database');
var db = mongoose.createConnection(config.database);

// Require models
const Wholesaler = require('./wholesaler');

// Define Investor schema with proper attributes
const InvestorSchema = mongoose.Schema({
  userType: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    required: true
  },
  phoneNumber: {
    type: String
  },
  wholesalers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wholesaler'
  }],
  properties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }]
});

const Investor = module.exports = db.model('Investor', InvestorSchema);

module.exports.addInvestor = function(newInvestor, callback) {
  newInvestor.save(callback);
};

module.exports.getAllInvestors = function() {

};

module.exports.getInvestorById = function(id, callback) {

};