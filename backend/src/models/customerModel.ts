// const pool = require('../config/db');
import pool from '../config/db'

export async function getAll() {
  const res = await pool.query(`
    SELECT 
      c.id AS customer_id,
      c.name AS customer_name,
      c.total_features,
      s.name AS segment,
      COALESCE(
        (SELECT json_agg(e) FROM customer_events e WHERE e.customer_id = c.id), '[]'
      ) AS events,
      COALESCE(
        (SELECT json_agg(t) FROM support_tickets t WHERE t.customer_id = c.id), '[]'
      ) AS tickets,
      COALESCE(
        (SELECT json_agg(i) FROM invoices i WHERE i.customer_id = c.id), '[]'
      ) AS invoices
    FROM customers c
    LEFT JOIN segments s ON c.segment_id = s.id
    ORDER BY c.id;
  `);


  return res.rows;
}

export async function getById(id: number) {
  const res = await pool.query('SELECT ' +
    "c.id AS customer_id, " +
    "c.name AS customer_name, " +
    "c.total_features AS total_features, " +
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

export async function addRecord(
  customerId: number,
  options: {
    event?: {
      eventType: string;
      event_data?: any;

    };
    ticket?: { status: string; priority: string };
    invoice?: { amount: number; dueDate: string; status: string };
  }
) {
  if (!options.event && !options.ticket && !options.invoice) {
    // throw early before starting the transaction
    throw new Error(
      "No data provided. Include at least one of: event, ticket, or invoice."
    );
  }
  
  try {
    await pool.query("BEGIN");
    // Add event
    if (options.event) {
      if (!options.event.event_data) options.event.event_data = {};
      await pool.query(
        `INSERT INTO customer_events (customer_id, event_type, created_at, event_data)
         VALUES ($1, $2, NOW(), $3)`,
        [customerId, options.event.eventType, JSON.stringify(options.event.event_data)]
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


// module.exports = { getAll, getById, addRecord };
