const express = require('express');
const router = express.Router();
const datasetController = require('../controllers/datasetController');

router.get('/', datasetController.getAllDatasets);

module.exports = router;