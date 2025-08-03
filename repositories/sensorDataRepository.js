const fs = require('fs').promises;
const path = require('path');

exports.getAllSensorData = async () => {
  const dataPath = process.env.SENSORDATA_PATH || path.join(__dirname, '../data/sensordata.json');
  const data = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(data);
};