const datasetService = require('../services/datasetService');

exports.getAllDatasets = async (req, res) => {
  try {
    const datasets = await datasetService.getAllDatasets();
    res.json(datasets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch datasets' });
  }
};