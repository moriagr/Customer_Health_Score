const pool = require('../config/db');

async function getAll() {
  const res = await pool.query('SELECT ' +
    "c.id AS customer_id, " +
    "c.name AS customer_name, " +
    "s.name AS segment, " +

    "e.id AS event_id, " +
    'e.event_type AS event_type, ' +
    'e.created_at AS event_created_at, ' +

    't.id AS ticket_id, ' +
    't.status AS ticket_status, ' +
    't.priority AS ticket_priority, ' +
    't.created_at AS ticket_created_at, ' +
    't.resolved_at AS ticket_resolved_at, ' +

    'i.id AS invoice_id, ' +
    'i.amount AS invoice_amount, ' +
    'i.due_date AS invoice_due_date, ' +
    'i.paid_date AS invoice_paid_date, ' +
    'i.status AS invoice_status ' +

    'FROM customers c ' +
    'LEFT JOIN segments s ON c.segment_id = s.id ' +
    'LEFT JOIN customer_events e ON c.id = e.customer_id ' +
    'LEFT JOIN support_tickets t ON c.id = t.customer_id ' +
    'LEFT JOIN invoices i ON c.id = i.customer_id ' +
    'ORDER BY c.id;');


  return res.rows;
}

async function getById(id) {
  const res = await pool.query('SELECT ' +
    "c.id AS customer_id, " +
    "c.name AS customer_name, " +
    "s.name AS segment, " +

    "e.id AS event_id, " +
    'e.event_type AS event_type, ' +
    'e.created_at AS event_created_at, ' +

    't.id AS ticket_id, ' +
    't.status AS ticket_status, ' +
    't.priority AS ticket_priority, ' +
    't.created_at AS ticket_created_at, ' +
    't.resolved_at AS ticket_resolved_at, ' +

    'i.id AS invoice_id, ' +
    'i.amount AS invoice_amount, ' +
    'i.due_date AS invoice_due_date, ' +
    'i.paid_date AS invoice_paid_date, ' +
    'i.status AS invoice_status ' +

    'FROM customers c ' +
    'LEFT JOIN segments s ON c.segment_id = s.id ' +
    'LEFT JOIN customer_events e ON c.id = e.customer_id ' +
    'LEFT JOIN support_tickets t ON c.id = t.customer_id ' +
    'LEFT JOIN invoices i ON c.id = i.customer_id ' +
    ' WHERE customer_id = $1', [id]);
  return res.rows[0];
}

async function addEvent(customerId, eventType) {
  await pool.query(
    'INSERT INTO events (customer_id, event_type, created_at) VALUES ($1, $2, NOW())',
    [customerId, eventType]
  );
}

module.exports = { getAll, getById, addEvent };
