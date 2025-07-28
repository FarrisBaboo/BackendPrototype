const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

//Get /streams - Return the available processed data stream (in .json format)
router.get('/streams', (req, res) => {
  const filePath = path.join(__dirname, '../mock_data/processed_data.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading processed_data.json:', err);
      return res.status(500).json({ error: 'Failed to load stream data' });
    }

    try {
      const parsedData = JSON.parse(data);
      res.json(parsedData);
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
      res.status(500).json({ error: 'Invalid JSON format' });
    }
  });
});

//POST /data — Return mock time-series data for selected streams
router.post('/data', (req, res) => {
  const { streamNames, timeWindow } = req.body;
  const filePath = path.join(__dirname, '../mock_data/processed_data.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading processed_data.json:', err);
      return res.status(500).json({ error: 'Failed to load data' });
    }

    try {
      const allEntries = JSON.parse(data);
      const start = new Date(timeWindow.start).getTime();
      const end = new Date(timeWindow.end).getTime();

      // Filter entries by time window
      const filteredEntries = allEntries.filter(entry => {
        const ts = new Date(entry.created_at).getTime();
        return ts >= start && ts <= end;
      });

      // Build response per stream name
      const response = streamNames.map(name => ({
        streamName: name,
        values: filteredEntries.map(entry => ({
          timestamp: entry.created_at,
          value: entry[name]
        })).filter(v => v.value !== undefined)
      }));

      res.json(response);
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr);
      res.status(500).json({ error: 'Invalid JSON format' });
    }
  });
});

//POST /correlate — Return mock correlation matrix
router.post('/correlate', (req, res) => {
    /*
    Write logic
    */
});

module.exports = router;