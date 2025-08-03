const sensorStreamRepository = require('../repositories/sensorStreamRepository');

exports.getAllSensorStreams = async () => {
  return await sensorStreamRepository.getAllSensorStreams();
};