const deviceRepository = require('../repositories/deviceRepository');

exports.getAllDevices = async () => {
  return await deviceRepository.getAllDevices();
};