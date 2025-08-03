const sensorStreamService = require('../services/sensorStreamService');

exports.getAllSensorStreams = async (req, res) => {
  try {
    const streams = await sensorStreamService.getAllSensorStreams();
    res.json(streams);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sensor streams' });
  }
};