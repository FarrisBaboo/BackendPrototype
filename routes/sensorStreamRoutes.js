const express = require('express');
const router = express.Router();
const sensorStreamController = require('../controllers/sensorStreamController');

router.get('/', sensorStreamController.getAllSensorStreams);

module.exports = router;