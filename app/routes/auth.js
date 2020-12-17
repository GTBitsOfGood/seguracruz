
const crypto = require('crypto');
const express = require('express');
const queries = require('../res/query');
const utils = require('../res/utils');
const jwt = require('jsonwebtoken');
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
            let token = utils.generateAccessToken(id);
            res.cookie('token', token, {
              maxAge: 60 * 60 * 1000 * 12,
              httpOnly: true,
              secure: false,
              sameSite: true
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
    res.status(400).json({success: 0, message: "username or password missing."})
  }
});

router.post('/verify', (req, res) => {
  const token = req.cookies.token
  if (token == null) return res.status(401).json({success: 0, message: "missing token"});

  jwt.verify(token, process.env.TOKEN_SECRET, (err) => {
    if (err) return res.status(401).json({success: 0, message: "unauthorized"});
    res.status(200).json({success: 1, message: "token verified"})
  });
});

module.exports = router