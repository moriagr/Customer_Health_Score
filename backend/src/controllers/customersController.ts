const customerModel = require('../models/customerModel');
import { calcScore, convertIntoCurrentAndPrev, separateSupportTickets, calcSupportScore, calculate, calcPaymentScore, categorize, calculateDetailed } from '../services/healthScore';
import { Customer, partCustomer } from '../type/healthScoreType';
import { Request, Response } from 'express';
import {logger} from '../utils/logger';

export async function getAllCustomersWithHealth(req: Request, res: Response) {
    try {
        // Reuse the same service as /api/customers
        const customers = await getCustomers();

        if (!customers || customers.length === 0) {
            logger.warn("No customers found for dashboard");
            return res.status(404).json({ message: "No customers found" });
        }

        // Sort by health score ascending (lowest = at risk)
        const sorted = [...customers].sort((a, b) => a.score - b.score);

        // Top 5 at-risk customers
        const topAtRisk = sorted.slice(0, 5);

        // Summary counts
        const total = customers.length;
        const healthyCount = customers.filter((c: partCustomer) => c.category === "Healthy").length;
        const mediumCount = customers.filter((c: partCustomer) => c.category === "Middle").length;
        const atRiskCount = customers.filter((c: partCustomer) => c.category === "At Risk").length;

        logger.info("Fetched dashboard data", { total, healthyCount, mediumCount, atRiskCount });
        // Response payload
        res.json({
            summary: {
                total_customers: total,
                Healthy: healthyCount,
                Middle: mediumCount,
                "At Risk": atRiskCount,
            },
            topAtRisk: topAtRisk.map(c => ({
                id: c.id,
                name: c.name,
                score: c.score,
                segment: c.segment,
            })),
        });
    } catch (err) {
        logger.error("Error in getAllCustomersWithHealth", { error: err instanceof Error ? err.message : err });
        res.status(500).json({ error: err instanceof Error ? err.message : "Failed to load dashboard data" });
    }
}

export async function getCustomers() {
    try {
        const allCustomers = await customerModel.getAll();

        if (!allCustomers || allCustomers.length === 0) {
            logger.warn("No customers returned from model.getAll()");
            return [];
        }
        const result: any = [];

        allCustomers.forEach((data: Customer) => {
            const { loginsPrev, loginsCurrent, featuresPrev, featuresCurrent, apiCurrent, apiPrev } = convertIntoCurrentAndPrev(data.events);
            const { highTickets, mediumTickets, openTickets, closedTickets, pendingTickets } = separateSupportTickets(data.tickets);
            const loginScore = calcScore(loginsCurrent, loginsPrev);
            const featureScore = calcScore(featuresCurrent, featuresPrev);
            const supportScore = calcSupportScore(highTickets, openTickets, mediumTickets, closedTickets, pendingTickets);
            const apiScore = calcScore(apiCurrent, apiPrev);
            const paymentScore = calcPaymentScore(data.invoices).score;

            const healthScore = calculate({
                featureScore, loginScore, supportScore, paymentScore, apiScore
            });
            result.push({
                id: data.customer_id,
                name: data.customer_name,
                segment: data.segment,
                score: healthScore.total,
                category: categorize(healthScore.total),
            })
        });
        logger.info("Calculated health scores for customers", { count: result.length });

        return result;
    } catch (err) {
        logger.error("Error in getCustomers", { error: err instanceof Error ? err.message : String(err) });
        throw new Error(`Error fetching customers: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export async function getAllCustomers(req: Request, res: Response) {
    try {
        const customersWithHealth = await getCustomers();
        if (!customersWithHealth || customersWithHealth.length === 0) {
            logger.warn("No customers found in getAllCustomers");
            return res.status(404).json({ error: "No customers found" });
        }

        logger.info("Fetched all customers with health scores", { count: customersWithHealth.length });
        res.json(customersWithHealth);
    } catch (err) {
        logger.error("Error in getAllCustomers", { error: err instanceof Error ? err.message : String(err) });
        res.status(500).json({ error: err instanceof Error ? err.message : "An unknown error occurred" });
    }
}

export async function getCustomerHealth(req: Request, res: Response) {
    try {
        const customer = await customerModel.getById(req.params.id);
        if (!customer) {
            logger.warn("Customer not found in getCustomerHealth", { customerId: req.params.id });
            return res.status(404).json({ error: "Customer not found" });
        }

        const health = calculateDetailed(customer);
        logger.info("Calculated detailed health for customer", { customerId: req.params.id, score: health.score });

        res.json(health);
    } catch (err) {
        logger.error("Error in getCustomerHealth", { customerId: req.params.id, error: err instanceof Error ? err.message : String(err) });
        res.status(500).json({ error: err instanceof Error ? err.message : "An unknown error occurred" });
    }
}

export async function recordEvent(req: Request, res: Response) {
    try {
        const { options } = req.body;
        await customerModel.addRecord(req.params.id, options);
        logger.info("Recorded customer event", { customerId: req.params.id, options });
        res.status(201).json({ message: "Event recorded" });
    } catch (err) {
        logger.error("Error recording customer event", { customerId: req.params.id, error: err instanceof Error ? err.message : err });
        res.status(500).json({ error: "Error saving customer events: " + (err instanceof Error ? err.message : "Unknown error") });
    }
}