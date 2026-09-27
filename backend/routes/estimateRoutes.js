const express = require('express');
const router = express.Router();
const { createEstimate, getEstimates } = require('../controllers/estimateController');

router.get('/', getEstimates);
router.post('/', createEstimate);

module.exports = router;
