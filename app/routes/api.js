const express = require('express');
const queries = require('../res/query');
const router = express.Router();
const winston = require('../res/winston');

// All reports
router.get('/reports', (req, res) => {
  queries.selectAllRecords()
    .then(data => res.status(200).json(data))
    .catch(err => {
      winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      res.status(500).json([{"error": err}]);
      throw err;
    });
});

module.exports = router