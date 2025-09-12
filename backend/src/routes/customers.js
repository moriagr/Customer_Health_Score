const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomerHealth, recordEvent } = require('../controllers/customersController.ts');

// GET /api/customers
router.get('/', getAllCustomers);

// GET /api/customers/:id/health
router.get('/:id/health', getCustomerHealth);

// POST /api/customers/:id/events
router.post('/:id/events', recordEvent);

module.exports = router;
