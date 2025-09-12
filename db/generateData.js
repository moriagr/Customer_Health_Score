const faker = require("faker");
const db = require('../backend/src/config/db')
(async () => {
    try {
        const client = await db.connect();

        console.log("Truncating tables...");
        await client.query(`
      TRUNCATE segments, customers, customer_events, support_tickets, invoices RESTART IDENTITY CASCADE;
    `);

        // --- 2. Segments ---
        const segments = ["Enterprise", "SMB", "Startup"];
        console.log("Inserting segments...");
        for (const seg of segments) {
            await client.query("INSERT INTO segments (name) VALUES ($1) ON CONFLICT DO NOTHING", [seg]);
        }

        // --- 3. Customers ---
        const customers = [];
        console.log("Inserting customers...");
        for (let i = 0; i < 50; i++) {
            const name = faker.company.companyName();
            const segment_id = Math.floor(Math.random() * segments.length) + 1;
            const created_at = faker.date.past(1);
            const res = await client.query(
                "INSERT INTO customers (name, segment_id, created_at) VALUES ($1, $2, $3) RETURNING id",
                [name, segment_id, created_at]
            );
            customers.push(res.rows[0].id);
        }

        // --- 4. Customer Events ---
        const eventTypes = ["login", "feature_use", "api_call"];
        const features = ["dashboard", "reporting", "alerts", "integration", "export"];

        console.log("Generating customer events...");
        for (const custId of customers) {
            const numEvents = faker.datatype.number({ min: 50, max: 200 });
            for (let i = 0; i < numEvents; i++) {
                const event_type = faker.random.arrayElement(eventTypes);
                let event_data = {};
                if (event_type === "feature_use") event_data = { feature: faker.random.arrayElement(features) };
                if (event_type === "api_call") event_data = { endpoint: `/api/${faker.random.arrayElement(features)}` };
                const created_at = faker.date.recent(90);
                await client.query(
                    "INSERT INTO customer_events (customer_id, event_type, event_data, created_at) VALUES ($1, $2, $3, $4)",
                    [custId, event_type, event_data, created_at]
                );
            }
        }

        // --- 5. Support Tickets ---
        const statuses = ["open", "closed", "pending"];
        const priorities = ["low", "medium", "high"];

        console.log("Generating support tickets...");
        for (const custId of customers) {
            const numTickets = faker.datatype.number({ min: 0, max: 5 });
            for (let i = 0; i < numTickets; i++) {
                const status = faker.random.arrayElement(statuses);
                const priority = faker.random.arrayElement(priorities);
                const created_at = faker.date.recent(90);
                const resolved_at = status === "closed" ? faker.date.between(created_at, new Date()) : null;
                await client.query(
                    "INSERT INTO support_tickets (customer_id, status, priority, created_at, resolved_at) VALUES ($1, $2, $3, $4, $5)",
                    [custId, status, priority, created_at, resolved_at]
                );
            }
        }

        // --- 6. Invoices ---
        const invoiceStatuses = ["unpaid", "paid", "late"];
        console.log("Generating invoices...");
        for (const custId of customers) {
            const numInvoices = faker.datatype.number({ min: 1, max: 4 });
            for (let i = 0; i < numInvoices; i++) {
                const amount = faker.finance.amount(100, 10000, 2);
                const due_date = faker.date.recent(90);
                const status = faker.random.arrayElement(invoiceStatuses);
                let paid_date = null;
                if (status === "paid") {
                    paid_date = faker.date.between(due_date, new Date(due_date.getTime() + 10 * 24 * 60 * 60 * 1000));
                } else if (status === "late") {
                    paid_date = faker.date.between(due_date, new Date(due_date.getTime() + 30 * 24 * 60 * 60 * 1000));
                }
                await client.query(
                    "INSERT INTO invoices (customer_id, amount, due_date, paid_date, status) VALUES ($1, $2, $3, $4, $5)",
                    [custId, amount, due_date, paid_date, status]
                );
            }
        }

        client.release();
        console.log("✅ Sample data generated successfully!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
