
const crypto = require('crypto');
const express = require('express');
const queries = require('../res/query');
const utils = require('../res/utils');
const jwt = require('jsonwebtoken');
const router = express.Router();
const winston = require('../res/winston');

// Get Users
router.get('/users', utils.authenticateToken, (req, res) => {
  queries.selectAllUsers()
    .then(rows => {
      res.status(200).json({success: 1, data: rows.map(item => item.username)});
    })
    .catch(err => {
      winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      res.status(500).json([{"error": err}]);
      throw err;
    });
});


// Add User
router.post('/user', utils.authenticateToken, (req, res) => {
  let username = typeof req.body.username !== "undefined" ? req.body.username : "";
  let password = typeof req.body.password !== "undefined" ? req.body.password : "";
  let hashPassword = crypto.createHmac('sha256', process.env.SECRET).update(password).digest('hex');
  if (username.length > 0 && password.length > 0) {
    queries.selectUser(username)
      .then(rows => {
        if (rows.length > 0) {
          res.status(400).json({success: 0, message: "username already exists"})
        } else {
          return queries.insertUser(username, hashPassword)
            .then(() => {
              res.status(200).json({success: 1, message: "user created"})
            })
            .catch(err => {
              winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
              res.status(500).json({success: 0, message: `user creation failed with error: ${err}`})
              throw err;
            });
        }
      });
  } else {
    res.status(400).json({success: 0, message: "username or password missing"})
  }
});

// Delete User
router.delete('/user', utils.authenticateToken, (req, res) => {
  let username = typeof req.body.username !== "undefined" ? req.body.username : "";
  if (username.length > 0) {
    queries.selectUser(username)
      .then(rows => {
        if (rows.length > 0) {
          return queries.deleteUser(username)
            .then(() => {
                res.status(200).json({success: 1, message: "user deleted"})
            })
            .catch(err => {
              winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
              res.status(500).json({success: 0, message: `user deletion failed with error: ${err}`})
              throw err;
            });
        } else {
          res.status(400).json({success: 0, message: "username does not exist"})
        }
      })
      
  } else {
    res.status(400).json({success: 0, message: "username or password missing"})
  }
});

// Login user
router.post('/login', (req, res) => {
  let username = typeof req.body.username !== "undefined" ? req.body.username : "";
  let password = typeof req.body.password !== "undefined" ? req.body.password : "";
  let hashPassword = crypto.createHmac('sha256', process.env.SECRET).update(password).digest('hex');
  if (username.length > 0 && password.length > 0) {
    queries.selectUser(username)
      .then(rows => {
        if (rows.length > 0) {
          if (rows[0].password === hashPassword) {
            let token = utils.generateAccessToken(username);
            res.cookie('token', token, {
              maxAge: 60 * 60 * 1000 * 12,
              httpOnly: false,
              secure: false,
              sameSite: false
            })
            res.status(200).json({success: 1, message: "login successful"})
          } else {
            res.status(401).json({success: 0, message: "incorrect password"})
          }
        } else {
          res.status(401).json({success: 0, message: "no matching id exists"})
        }
      });
  } else {
    res.status(400).json({success: 0, message: "username or password missing"})
  }
});

// Logout user
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({success: 1, message: "logout successful"});
});

// Verify the user is still logged in
router.post('/verify', (req, res) => {
  const token = req.cookies.token
  if (token == null) return res.status(401).json({success: 0, message: "missing token"});

  jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
    if (err) return res.status(401).json({success: 0, message: "unauthorized"});
    res.status(200).json({success: 1, message: "token verified"})
  });
});

module.exports = router