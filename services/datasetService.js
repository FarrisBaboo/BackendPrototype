const datasetRepository = require('../repositories/datasetRepository');

exports.getAllDatasets = async () => {
  return await datasetRepository.getAllDatasets();
};