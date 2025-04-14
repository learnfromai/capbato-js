const express = require('express');
const router = express.Router();
const laboratoryController = require('../controllers/laboratory.controller');

router.post('/laboratory_results', laboratoryController.saveBloodChemistry);

module.exports = router;
