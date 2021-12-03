const express = require('express');
const queries = require('../res/query');
const utils = require('../res/utils');
const router = express.Router();
const winston = require('../res/winston');

// Get all reports
router.get('/reports', utils.authenticateToken, (req, res) => {
  queries.selectAllRecords()
    .then(data => {
      geojson = {
        type: 'FeatureCollection',
        features: []
      }
      for (const item of data) {
        newFeature = {
          type: 'Feature',
          properties: {
            id: item.id,
            timestamp: item.datetime,
            entities: item.vehicles,
            factors: item.factors,
            injury: item.injury,
            injury_description: item.injury_description,
            injury_first_aid: item.injury_first_aid
          },
          geometry: {
            type: 'Point',
            coordinates: [
              item.lon,
              item.lat
            ]
          }
        }
        geojson.features.push(newFeature);
      }
      res.status(200).json({success: 1, data: geojson});
    })
    .catch(err => {
      winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      res.status(500).json([{"error": err}]);
      throw err;
    });
});

module.exports = router