import pool from '../config/db'
import { logger } from '../utils/logger';


export async function getAll() {
  try {

    const res = await pool.query(`
    SELECT 
      c.id AS customer_id,
      c.name AS customer_name,
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
    ORDER BY c.name;
  `);


    logger.info("Fetched all customers", { count: res.rowCount });
    return res.rows;
  } catch (err: any) {
    logger.error("Error in getAll()", { error: err.message, stack: err.stack });
    throw err;
  }
}

export async function getById(id: number) {
  try {
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

    if (!res.rows[0]) {
      logger.warn("Customer not found", { id });
      return null;
    }

    logger.info("Fetched customer by id", { id });
    return res.rows[0];
  } catch (err: any) {
    logger.error("Error in getById()", { id, error: err.message, stack: err.stack });
    throw err;
  }
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
    logger.warn("Attempted to add empty record", { customerId });
    throw new Error("No data provided. Include at least one of: event, ticket, or invoice.");
  }


  try {
    await pool.query("BEGIN");
    logger.info("Transaction started", { customerId });

    if (options.event) {
      if (!options.event.event_data) options.event.event_data = {};
      await pool.query(
        `INSERT INTO customer_events (customer_id, event_type, created_at, event_data)
         VALUES ($1, $2, NOW(), $3)`,
        [customerId, options.event.eventType, JSON.stringify(options.event.event_data)]
      );
      logger.info("Inserted event", { customerId, type: options.event.eventType });
    }

    if (options.ticket) {
      const { status, priority } = options.ticket;
      await pool.query(
        `INSERT INTO support_tickets (customer_id, status, priority, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [customerId, status, priority]
      );
      logger.info("Inserted ticket", { customerId, status, priority });
    }

    if (options.invoice) {
      const { amount, dueDate, status } = options.invoice;
      await pool.query(
        `INSERT INTO invoices (customer_id, amount, due_date, status)
         VALUES ($1, $2, $3, $4)`,
        [customerId, amount, dueDate, status]
      );
      logger.info("Inserted invoice", { customerId, amount, dueDate, status });
    }

    await pool.query("COMMIT");
    logger.info("Transaction committed", { customerId });
  } catch (err: any) {
    await pool.query("ROLLBACK");
    logger.error("Transaction rolled back", { customerId, error: err.message, stack: err.stack });
    throw err;
  }
}