const sensorDataService = require('../services/sensorDataService');

exports.getAllSensorData = async (req, res) => {
  try {
    const data = await sensorDataService.getAllSensorData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sensor data' });
  }
};