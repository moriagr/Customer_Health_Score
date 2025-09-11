const pool = require('../config/db');

async function getAll() {
  const res = await pool.query('SELECT * FROM customers');
  return res.rows;
}

async function getById(id) {
  const res = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
  return res.rows[0];
}

async function addEvent(customerId, eventType) {
  await pool.query(
    'INSERT INTO events (customer_id, event_type, created_at) VALUES ($1, $2, NOW())',
    [customerId, eventType]
  );
}

module.exports = { getAll, getById, addEvent };
