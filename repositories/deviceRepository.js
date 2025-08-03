const fs = require('fs').promises;
const path = require('path');

exports.getAllDevices = async () => {
  const dataPath = process.env.DEVICES_PATH || path.join(__dirname, '../data/devices.json');
  const data = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(data);
};