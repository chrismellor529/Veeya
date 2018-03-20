const express = require('express');
const router = express.Router();

const user = require('../models/user');

// HTTP requests to /user

router.get('/:id', (req, res) => {
  user.getUserById(req.params.id)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.put('/updateProfileInfo/:id', (req, res) => {
  user.updateUserMyProfileInfo(req.body)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.put('/updatePassword/:id', (req, res) => {
  user.updatePassword(req.body)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.put('/updateProfilePhoto/:id', (req, res) => {
  user.updateProfilePhoto(req.params.id, req.body.photoURL)
    .then((response) => {
      res.status(201).json(response)
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get('/all', (req, res) => {
  user.getAllUsers()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get('/all/investors', (req, res) => {
  user.getAllInvestors()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get('/all/wholesalers', (req, res) => {
  user.getAllWholesalers()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get('/connections/:uid', (req, res) => {
  let user_id = req.params.uid;
  user.getAllConnections(user_id)
    .then((response) => {
      let idArray = response.data;
      return user.getAllConnectionsByIDs(idArray);
    })
    .then((response) => {
      if (response.success) {
        res.status(200).json(response);
      } else {
        res.status(500).json(response);
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    })
});

router.get('/pendingconnections/:id', (req, res) => {
  let userId = req.params.id;
  user.getPendingConnections(userId)
    .then((response) => {
      let idArray = response.data;
      if (idArray.length == 0) {
        return res.status(200).json(response);
      } else {
        return user.getAllConnectionsByIDs(idArray);
      }
    })
    .then((response) => {
      if (response.success) {
        res.status(200).json(response);
      } else {
        res.status(500).json(response);
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post('/addconnection', (req, res) => {
  user.addOutgoingConnectionRequest(req.body.currentUserId, req.body.connectionUserId)
    .then((response) => {
      return user.addIncomingConnectionRequest(req.body.currentUserId, req.body.connectionUserId);
    })
    .then((response) => {
      if (response.success) {
        res.status(201).json(response);
      } else {
        res.status(500).json(response);
      }
    })
    .catch((error) => {
      console.log("error catch:", error)
      res.status(500).json(error);
    })
});

router.post('/acceptconnection', (req, res) => {
  let responseObj = {
    success: true,
    message: 'Successfully added connection.',
    data: {
      currentUser: {},
      connectionUser: {}
    }
  }
  console.log("req.body:", req.body)
  user.acceptConnectionCurrentUser(req.body)
    .then((response) => {
      responseObj.data.currentUser = response.data
      return user.acceptConnectionConnectedUser(req.body)
    })
    .then((response) => {
      if (response.success) {
        responseObj.data.connectionUser = response.data;
        res.status(201).json(responseObj);
      } else {
        res.status(500).json(response);
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.put('/increaseViews', (req, res) => {
  let userId = req.body.id;

  user.increaseViewCount(userId)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});


module.exports = router;