import express from 'express';
import { getAllCustomersWithHealth } from '../controllers/customersController';
import {logger} from "../utils/logger";


const router = express.Router();

// GET /api/dashboard
// router.get('/', getAllCustomersWithHealth);

router.get('/', (req, res, next) => {
    logger.info("Incoming request", { method: req.method, url: req.originalUrl });
    next();
}, getAllCustomersWithHealth);

export = router;  // ✅ CommonJS-style export
