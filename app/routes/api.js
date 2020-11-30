const express = require('express');
const queries = require('../res/query');
const router = express.Router();
const winston = require('../res/winston');

// All reports
router.get('/reports', (req, res) => {
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
            vehicles: item.vehicles,
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
      res.status(200).json(geojson);
    })
    .catch(err => {
      winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      res.status(500).json([{"error": err}]);
      throw err;
    });
});

module.exports = router