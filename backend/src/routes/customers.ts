import express from 'express';
import { getAllCustomers, getCustomerHealth, recordEvent } from '../controllers/customersController';

const router = express.Router();

// GET /api/customers
router.get('/', getAllCustomers);

// GET /api/customers/:id/health
router.get('/:id/health', getCustomerHealth);

// POST /api/customers/:id/events
router.post('/:id/events', recordEvent);
export default router;
module.exports = router;
