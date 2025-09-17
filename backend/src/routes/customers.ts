import express from 'express';
import { getAllCustomers, getCustomerHealth, recordEvent } from '../controllers/customersController';
import { logger } from '../utils/logger';

const router = express.Router();

// GET /api/customers
router.get("/", (req, res, next) => {
    logger.info("Incoming request", { method: req.method, url: req.originalUrl });
    next();
}, getAllCustomers);

// GET /api/customers/:id/health
router.get("/:id/health", (req, res, next) => {
    logger.info("Incoming request", { method: req.method, url: req.originalUrl, customerId: req.params.id });
    next();
}, getCustomerHealth);

// POST /api/customers/:id/events
router.post('/:id/events', (req, res, next) => {
    logger.info("Incoming request", { method: req.method, url: req.originalUrl, customerId: req.params.id });
    next();
}, recordEvent);

export = router;   // ✅ CommonJS-style export


