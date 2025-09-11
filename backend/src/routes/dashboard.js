const express = require('express');
const router = express.Router();
const { getAllCustomersWithHealth } = require('../controllers/customersController');

// GET /api/dashboard
router.get('/', getAllCustomersWithHealth);

module.exports = router;
