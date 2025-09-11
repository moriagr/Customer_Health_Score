const customerModel = require('../models/customerModel');
const healthScoreService = require('../services/healthScoreService');

async function getAllCustomers(req, res) {
  try {
    const customers = await customerModel.getAll();
    const customersWithHealth = customers.map(c => ({
      ...c,
      healthScore: healthScoreService.calculate(c)
    }));
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

module.exports = { getAllCustomers, getCustomerHealth, recordEvent };
