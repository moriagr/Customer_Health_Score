// const { calcLoginAndApiScore, convertIntoCurrentAndPrev, separateSupportTickets, calcPaymentScore, calculateDetailed, calcSupportScore, calculate, categorize } = require("../services/healthScoreService");

const customerModel = require('../models/customerModel');
import { calcScore, convertIntoCurrentAndPrev, separateSupportTickets, calcSupportScore, calculate, calcPaymentScore, categorize, calculateDetailed } from '../services/healthScore';
import { Customer, partCustomer } from '../type/healthScoreType';
import { Request, Response } from 'express';

export async function getAllCustomersWithHealth(req: Request, res: Response) {
    try {
        // Reuse the same service as /api/customers
        const customers = await getCustomers();

        if (!customers || customers.length === 0) {
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
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Failed to load dashboard data" });
        }
    }
}

export async function getCustomers() {
    try {
        const allCustomers = await customerModel.getAll();
        // Group rows by customer
        if (!allCustomers || allCustomers.length === 0) {
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
        return result;
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Error fetching customers: ${err.message}`);
        } else {
            throw new Error(`Error fetching customers: ${String(err)}`);
        }
    }
}

export async function getAllCustomers(req: Request, res: Response) {
    try {
        const customersWithHealth = await getCustomers();
        if (!customersWithHealth || customersWithHealth.length === 0) {
            return res.status(404).json({ error: "No customers found" });
        }
        res.json(customersWithHealth);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}

export async function getCustomerHealth(req: Request, res: Response) {
    try {
        const customer = await customerModel.getById(req.params.id);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });

        const health = calculateDetailed(customer);
        res.json(health);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}

export async function recordEvent(req: Request, res: Response) {
    try {
        const { options } = req.body;
        await customerModel.addRecord(req.params.id, options);
        res.status(201).json({ message: 'Event recorded' });
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: "Error saving customer events: " + err.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}

module.exports = { getAllCustomers, getCustomers, getCustomerHealth, recordEvent, getAllCustomersWithHealth };
