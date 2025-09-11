const customerModel = require('../models/customerModel');
const healthScoreService = require('../services/healthScoreService');


async function getAllCustomersWithHealth(req, res) {
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
        const healthyCount = customers.filter(c => c.category === "healthy").length;
        const mediumCount = customers.filter(c => c.category === "medium").length;
        const atRiskCount = customers.filter(c => c.category === "at_risk").length;

        // Response payload
        res.json({
            summary: {
                total_customers: total,
                healthy: healthyCount,
                medium: mediumCount,
                at_risk: atRiskCount,
                percentages: {
                    healthy: ((healthyCount / total) * 100).toFixed(1),
                    medium: ((mediumCount / total) * 100).toFixed(1),
                    at_risk: ((atRiskCount / total) * 100).toFixed(1),
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
        const customers = await customerModel.getAll();
        const customersWithHealth = customers.map(c => ({
            ...c,
            score: healthScoreService.calculate(c) | 0,
            category: healthScoreService.categorize(c)
        }));

        return customersWithHealth;
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getAllCustomers(req, res) {
    try {
        const customersWithHealth = getCustomers();

        res.json(customersWithHealth);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getCustomerHealth(req, res) {
    try {
        const customer = await customerModel.getById(req.params.id);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });

        const health = healthScoreService.calculateDetailed(customer);
        res.json(health);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function recordEvent(req, res) {
    try {
        const { eventType } = req.body;
        await customerModel.addEvent(req.params.id, eventType);
        res.status(201).json({ message: 'Event recorded' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getAllCustomers, getCustomerHealth, recordEvent, getAllCustomersWithHealth };
