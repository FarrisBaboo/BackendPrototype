const fs = require('fs').promises;
const path = require('path');

exports.getAllDatasets = async () => {
  const dataPath = process.env.DATASETS_PATH || path.join(__dirname, '../data/datasets.json');
  const data = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(data);
};