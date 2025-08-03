const fs = require('fs').promises;
const path = require('path');

exports.getAllSensorStreams = async () => {
  const dataPath = process.env.SENSORSTREAMS_PATH || path.join(__dirname, '../data/sensorstreams.json');
  const data = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(data);
};