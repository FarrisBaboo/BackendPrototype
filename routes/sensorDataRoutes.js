const express = require('express');
const router = express.Router();
const sensorDataController = require('../controllers/sensorDataController');

router.get('/', sensorDataController.getAllSensorData);

module.exports = router;