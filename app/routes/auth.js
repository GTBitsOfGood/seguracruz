
const crypto = require('crypto');
const express = require('express');
const queries = require('../res/query');
const utils = require('../res/utils');
const router = express.Router();

// All reports
router.post('/login', (req, res) => {
  let id = typeof req.body.id !== "undefined" ? req.body.id : "";
  let password = typeof req.body.password !== "undefined" ? req.body.password : "";
  let hashPassword = crypto.createHmac('sha256', process.env.SECRET).update(password).digest('hex');
  if (id.length > 0 && password.length > 0) {
    queries.selectUser(id)
      .then(rows => {
        if (rows.length > 0) {
          if (rows[0].password === hashPassword) {
            res.status(200).json({success: 1, token: utils.generateAccessToken(id)})
          } else {
            res.status(200).json({success: 0, message: "incorrect password"})
          }
        } else {
          res.status(200).json({success: 0, message: "no matching id exists"})
        }
      });
  } else {
    res.status(400).json({success: 0, message: "username or password missing."})
  }
});

module.exports = router