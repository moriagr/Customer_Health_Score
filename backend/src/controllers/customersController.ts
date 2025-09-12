const { calcFeatureAdoptionScore, calcLoginAndApiScore, calcPaymentScore, calculateDetailed, calcSupportScore, calculate, categorize } = require("../services/healthScoreService");

const customerModel = require('../models/customerModel');
import { customerMapType, CustomerRow, partCustomer } from '../type/healthScoreType';
import { Request, Response } from 'express';

async function getAllCustomersWithHealth(req: Request, res: Response) {
    try {
        // Reuse the same service as /api/customers
        const customers = await getCustomers();

        if (!customers || customers.length === 0) {
            return res.json({ message: "No customers found" });
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
                healthy: healthyCount,
                medium: mediumCount,
                at_risk: atRiskCount,
                percentages: {
                    Healthy: ((healthyCount / total) * 100).toFixed(1),
                    Middle: ((mediumCount / total) * 100).toFixed(1),
                    "At Risk": ((atRiskCount / total) * 100).toFixed(1),
                },
            },
            top_at_risk_customers: topAtRisk.map(c => ({
                id: c.id,
                name: c.name,
                score: c.score,
            })),
        });
    } catch (err) {
        console.error("Error in /api/dashboard:", err);
        res.status(500).json({ error: "Failed to load dashboard data" });
    }
}



async function getCustomers() {
    try {
        const allCustomers = await customerModel.getAll();
        // Group rows by customer
        const customersMap = new Map<number, customerMapType>();

        const now = new Date();
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        const twoMonthsAgo = new Date(now);
        twoMonthsAgo.setMonth(now.getMonth() - 2);

        allCustomers.forEach((row: CustomerRow) => {
            if (!customersMap.has(row.customer_id)) {
                customersMap.set(row.customer_id, {
                    name: row.customer_name,
                    segment: row.segment,
                    loginsCurrent: 0,
                    loginsPrev: 0,

                    featuresCurrent: 0,
                    featuresPrev: 0,

                    openTickets: 0,
                    mediumTickets: 0,
                    highTickets: 0,
                    closedTickets: 0,

                    apiCurrent: 0,
                    apiPrev: 0,

                    invoices: [],
                });
            }
            const customer = customersMap.get(row.customer_id)!;

            if (row.event_id) {
                if (row.event_type === "login") {
                    if (row.event_created_at >= oneMonthAgo) customer.loginsCurrent += 1;
                    else if (row.event_created_at >= twoMonthsAgo) customer.loginsPrev += 1;
                } else if (row.event_type === "feature_use") {
                    if (row.event_created_at >= oneMonthAgo) customer.featuresCurrent += 1;
                    else if (row.event_created_at >= twoMonthsAgo) customer.featuresPrev += 1;
                } else if (row.event_type === "api_call") {
                    if (row.event_created_at >= oneMonthAgo) customer.apiCurrent += 1;
                    else if (row.event_created_at >= twoMonthsAgo) customer.apiPrev += 1;
                }
            }
            if (row.ticket_id) {
                if (row.ticket_status === "open") {
                    if (row.ticket_priority === "high") {
                        customer.highTickets += 1;
                    } else if (row.ticket_priority === "medium") {
                        customer.mediumTickets += 1;
                    } else {
                        customer.openTickets += 1;
                    }
                } else if (row.ticket_status === "closed") {
                    customer.closedTickets += 1;
                }
            }

            if (row.invoice_id) {
                customer.invoices.push({
                    amount: row.invoice_amount!,
                    due_date: row.invoice_due_date!,
                    paid_date: row.invoice_paid_date,
                    status: row.invoice_status!
                });
            }
        });

        const result: any = [];

        customersMap.forEach((data, id) => {
            const loginScore = calcLoginAndApiScore(data.loginsCurrent, data.loginsPrev);
            const featureScore = calcFeatureAdoptionScore(data.featuresCurrent, data.featuresPrev);
            const supportScore = calcSupportScore(data.highTickets, data.openTickets, data.mediumTickets);
            const apiScore = calcLoginAndApiScore(data.apiCurrent, data.apiPrev);
            const paymentScore = calcPaymentScore(data.invoices);

            const healthScore = calculate({
                featureScore, loginScore, supportScore, paymentScore, apiScore
            });
            result.push({
                customerId: id,
                name: data.name,
                segment: data.segment,
                score: healthScore,
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

async function getAllCustomers(req: Request, res: Response) {
    try {
        const customersWithHealth = await getCustomers();

        res.json(customersWithHealth);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}

async function getCustomerHealth(req: Request, res: Response) {
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

async function recordEvent(req: Request, res: Response) {
    try {
        console.log('✌️req.body --->', req.body);
        const { options } = req.body;
        await customerModel.addRecord(req.params.id, options);
        res.status(201).json({ message: 'Event recorded' });
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}

module.exports = { getAllCustomers, getCustomerHealth, recordEvent, getAllCustomersWithHealth };
