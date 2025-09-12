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

async function getById(id: number) {
  const res = await pool.query('SELECT ' +
    "c.id AS customer_id, " +
    "c.name AS customer_name, " +
    "s.name AS segment, " +

    "COALESCE(" +
    '(SELECT json_agg(e) ' +
    'FROM customer_events e ' +
    "WHERE e.customer_id = c.id), '[]' " +
    ") AS events, " +

    "COALESCE(" +
    '(SELECT json_agg(t) ' +
    'FROM support_tickets t ' +
    "WHERE t.customer_id = c.id), '[]' " +
    ") AS tickets, " +

    "COALESCE(" +
    '(SELECT json_agg(i) ' +
    'FROM invoices i ' +
    "WHERE i.customer_id = c.id), '[]' " +
    ") AS invoices " +

    'FROM customers c ' +
    'LEFT JOIN segments s ON c.segment_id = s.id ' +

    ' WHERE c.id = $1', [id]);
  return res.rows[0];
}

async function addRecord(
  customerId: number,
  options: {
    eventType?: string;
    event_data?: any;
    ticket?: { status: string; priority: string };
    invoice?: { amount: number; dueDate: string; status: string };
  }
) {
  try {
    await pool.query("BEGIN");

    // Add event
    if (options.eventType) {
      if (!options.event_data) options.event_data = {};
      await pool.query(
        `INSERT INTO customer_events (customer_id, event_type, created_at, event_data)
         VALUES ($1, $2, NOW(), $3)`,
        [customerId, options.eventType, JSON.stringify(options.event_data)]
      );
    }

    // Add ticket
    if (options.ticket) {
      const { status, priority } = options.ticket;
      await pool.query(
        `INSERT INTO support_tickets (customer_id, status, priority, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [customerId, status, priority]
      );
    }

    // Add invoice
    if (options.invoice) {
      const { amount, dueDate, status } = options.invoice;
      await pool.query(
        `INSERT INTO invoices (customer_id, amount, due_date, status)
         VALUES ($1, $2, $3, $4)`,
        [customerId, amount, dueDate, status]
      );
    }

    await pool.query("COMMIT");
  } catch (err) {
    await pool.query("ROLLBACK");
    throw err;
  }
}


module.exports = { getAll, getById, addRecord };
