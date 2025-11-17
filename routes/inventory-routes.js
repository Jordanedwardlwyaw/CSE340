const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventory-controller');

router.get('/classification/:classification', controller.showClassification);
router.get('/vehicle/:id', controller.showVehicle);

module.exports = router;
