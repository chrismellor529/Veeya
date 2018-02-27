const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user.js');

const keys = require('../config/keys.js');

// POST HTTP to /login for user
router.post('/', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email)
    .then((response) => {
      User.comparePassword(password, response.data.password, (error, isMatchResponse) => {
        if (error) {
          return res.status(500).json({
            success: isMatchResponse.success,
            message: isMatchResponse.message,
            error: isMatchResponse.error
          });
        }

        if (isMatchResponse) {
          const token = jwt.sign(response.data.toJSON(), keys.secret, {
            expiresIn: 604800
          });

          res.status(201).json({
            success: isMatchResponse.success,
            message: 'Successfully logged in. Welcome back ' + response.data.firstName + '!',
            token: 'JWT ' + token,
            user: {
              id: response.data._id,
              firstName: response.data.firstName,
              user_type: response.data.userType
            }
          });
        } else {
          return res.status(500).json({
            success: isMatchResponse.success,
            message: isMatchResponse.message
          });
        }
      });
    })
    .catch((error) => {
      res.status(500).json(error);
    });

});


module.exports = router;