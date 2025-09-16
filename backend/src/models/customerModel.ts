// const pool = require('../config/db');
import pool from '../config/db'
import {logger} from '../utils/logger';

// export async function getDashboardData() {
//   const res = await pool.query(`
//     WITH customer_metrics AS (
//       SELECT 
//           c.id AS customer_id,
//           c.name AS customer_name,
//           s.name AS segment,

//           -- ========== EVENTS ========== 'api_call
//           -- Features
//           SUM(CASE WHEN e.event_type = 'feature_use' AND e.created_at >= date_trunc('month', current_date) THEN 1 ELSE 0 END) AS features_current,
//           SUM(CASE WHEN e.event_type = 'feature_use' AND e.created_at >= date_trunc('month', current_date - interval '1 month')
//                                     AND e.created_at < date_trunc('month', current_date) THEN 1 ELSE 0 END) AS features_prev,

//           -- Logins
//           SUM(CASE WHEN e.event_type = 'login' AND e.created_at >= date_trunc('month', current_date) THEN 1 ELSE 0 END) AS logins_current,
//           SUM(CASE WHEN e.event_type = 'login' AND e.created_at >= date_trunc('month', current_date - interval '1 month')
//                                     AND e.created_at < date_trunc('month', current_date) THEN 1 ELSE 0 END) AS logins_prev,

//           -- API Calls
//           SUM(CASE WHEN e.event_type = 'api_call' AND e.created_at >= date_trunc('month', current_date) THEN 1 ELSE 0 END) AS api_current,
//           SUM(CASE WHEN e.event_type = 'api_call' AND e.created_at >= date_trunc('month', current_date - interval '1 month')
//                                     AND e.created_at < date_trunc('month', current_date) THEN 1 ELSE 0 END) AS api_prev,

//           -- ========== SUPPORT ==========
//           SUM(CASE WHEN t.status = 'open' AND t.priority = 'high' THEN 1 ELSE 0 END) AS high_tickets,
//           SUM(CASE WHEN t.status = 'open' AND t.priority = 'medium' THEN 1 ELSE 0 END) AS medium_tickets,
//           SUM(CASE WHEN t.status = 'open' AND (t.priority IS NULL OR t.priority NOT IN ('high','medium')) THEN 1 ELSE 0 END) AS open_tickets,
//           SUM(CASE WHEN t.status = 'closed' THEN 1 ELSE 0 END) AS closed_tickets,
//           SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) AS pending_tickets,

//           -- ========== PAYMENTS ==========
//           SUM(CASE WHEN i.paid_date IS NOT NULL AND i.paid_date <= i.due_date THEN 1 ELSE 0 END) AS ontime_invoices,
//           SUM(CASE WHEN i.paid_date IS NOT NULL AND i.paid_date > i.due_date THEN 1 ELSE 0 END) AS late_invoices,
//           SUM(CASE WHEN i.paid_date IS NULL AND i.due_date < now() THEN 1 ELSE 0 END) AS overdue_invoices,
//           SUM(CASE WHEN i.paid_date IS NULL AND i.due_date >= now() THEN 1 ELSE 0 END) AS unpaid_invoices,
//           COUNT(i.id) AS total_invoices

//       FROM customers c
//       LEFT JOIN segments s ON c.segment_id = s.id
//       LEFT JOIN customer_events e ON e.customer_id = c.id
//       LEFT JOIN support_tickets t ON t.customer_id = c.id
//       LEFT JOIN invoices i ON i.customer_id = c.id
//       GROUP BY c.id, s.name
//   ),
//   scored AS (
//       SELECT *,
//           -- calcScore(current, prev)
//           CASE 
//               WHEN features_current = 0 THEN 0
//               WHEN features_prev = 0 THEN 100

//               ELSE 
//               ROUND((100.0 * features_current / NULLIF(features_prev, 0))::numeric, 1)
//           END AS feature_score,

//           CASE 
//               WHEN logins_current = 0 THEN 0
//               WHEN logins_prev = 0 THEN 100
//               ELSE ROUND((100.0 * logins_current / NULLIF(logins_prev, 0))::numeric, 1)
//           END AS login_score,

//           CASE 
//               WHEN api_current = 0 THEN 0
//               WHEN api_prev = 0 THEN 100
//               ELSE ROUND((100.0 * api_current / NULLIF(api_prev, 0))::numeric, 1)
//           END AS api_score,

//           -- calcSupportScore
//           SUM(CASE WHEN t.status = 'open' AND t.priority = 'high' THEN 5
//                  WHEN t.status = 'open' AND t.priority = 'medium' THEN 2
//                  WHEN t.status = 'open' THEN 1
//                  WHEN t.status = 'pending' THEN 1
//                  ELSE 0 END) AS weighted_issues,
//           CASE 
//               WHEN (open_tickets + medium_tickets + high_tickets + pending_tickets) = 0 THEN 100
//               ELSE COALESCE(
//                   ROUND((100.0 - (weighted_issues::numeric / NULLIF(open_tickets + medium_tickets + high_tickets + pending_tickets,0)) * 20))::numeric, 1),
//                   100
//               )
//           END AS support_score,

//           -- calcPaymentScore
//           CASE 

//           unpaid_invoices
//               WHEN total_invoices = 0 THEN 100
//               ELSE COALESCE(
//                 ROUND((100.0 * ontime_invoices / NULLIF(ps.total_invoices, 0))::numeric, 1),
//                 100
//             )
//           END AS payment_score

//       FROM customer_metrics
//   ),
//   final_scores AS (
//       SELECT *,
//           ROUND(
//               feature_score * 0.30 +
//               login_score * 0.25 +
//               support_score * 0.20 +
//               payment_score * 0.15 +
//               api_score * 0.10
//           ,1) AS total_score,
//           CASE
//               WHEN (feature_score * 0.30 +
//                     login_score * 0.25 +
//                     support_score * 0.20 +
//                     payment_score * 0.15 +
//                     api_score * 0.10) >= 80 THEN 'Healthy'
//               WHEN (feature_score * 0.30 +
//                     login_score * 0.25 +
//                     support_score * 0.20 +
//                     payment_score * 0.15 +
//                     api_score * 0.10) >= 50 THEN 'Middle'
//               ELSE 'At Risk'
//           END AS category
//       FROM scored
//   ),
//   summary AS (
//       SELECT 
//           COUNT(*) AS total_customers,
//           COUNT(*) FILTER (WHERE category = 'Healthy') AS healthy_count,
//           COUNT(*) FILTER (WHERE category = 'Middle') AS middle_count,
//           COUNT(*) FILTER (WHERE category = 'At Risk') AS at_risk_count
//       FROM final_scores
//   ),
//   top_at_risk AS (
//       SELECT customer_id, customer_name, segment, total_score
//       FROM final_scores
//       ORDER BY total_score ASC
//       LIMIT 5
//   )
//   SELECT json_build_object(
//       'summary', (SELECT row_to_json(summary) FROM summary),
//       'topAtRisk', (SELECT json_agg(row_to_json(top_at_risk)) FROM top_at_risk)
//   ) AS dashboard_data;
//   `);


//   return res.rows;
// }


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