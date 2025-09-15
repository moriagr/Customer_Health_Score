import db from './config/db'
import faker from 'faker'

async function createSampleData() {
  // Create segments if they don't exist
  const segments = ['Enterprise', 'SMB', 'Startup'];
  for (const name of segments) {
    await db.query(`
      INSERT INTO segments (name)
      VALUES ($1)
      ON CONFLICT (name) DO NOTHING
    `, [name]);
  }

  console.log("1");
  // Fetch segment IDs to map names to IDs
  const resSegments = await db.query('SELECT * FROM segments');
  const segmentMap: { [key: string]: number } = {};
  resSegments.rows.forEach((row: { name: string; id: number }) => { segmentMap[row.name] = row.id; });
  console.log("2");
  
  // Generate customers
  const customerCount = 50;
  const customerIds: number[] = [];
  for (let i = 0; i < customerCount; i++) {
    const name = faker.company.companyName();
    const segmentName = segments[Math.floor(Math.random() * segments.length)];
    const segmentId = segmentMap[segmentName];
    const createdAt = faker.date.past(2); // within last 2 years
    const totalFeatures = Math.floor(Math.random() * (15 - 5 + 1)) + 3; // 3-15 features

    // 30% chance the customer is "at risk"
    const isAtRisk = Math.random() < 0.3;

    // Insert customer
    const res = await db.query(`
      INSERT INTO customers (name, segment_id, created_at, total_features)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, [name, segmentId, createdAt, totalFeatures]);
    const customerId = res.rows[0].id;
    customerIds.push(customerId);

    // If customer is "at risk", create risky support tickets and invoices
    if (isAtRisk) {
      // Create support tickets with "open" or "pending" status
      for (let j = 0; j < 3; j++) {
        await db.query(`
          INSERT INTO support_tickets (customer_id, status, priority, created_at)
          VALUES ($1, $2, $3, $4)
        `, [customerId, 'open', 'high', faker.date.recent(30)]);
      }

      // Create unpaid or late invoices
      for (let k = 0; k < 2; k++) {
        await db.query(`
          INSERT INTO invoices (customer_id, amount, due_date, paid_date, status)
          VALUES ($1, $2, $3, $4, $5)
        `, [
          customerId,
          faker.datatype.number({ min: 50, max: 2000, precision: 0.01 }),
          faker.date.between(faker.date.recent(60), new Date()),
          null,
          faker.helpers.randomize(['unpaid', 'late'])
        ]);
      }
    }
  }
  console.log("3");
  
  // Generate customer events over the last 3 months
  const eventTypes = ['login', 'feature_use', 'api_call'];
  for (const customerId of customerIds) {
    const eventCount = Math.floor(Math.random() * 20) + 10; // 10-30 events per customer
    for (let i = 0; i < eventCount; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      const eventData = (() => {
        switch (eventType) {
          case 'feature_use':
            return { feature: 'Feature ' + faker.datatype.number({ min: 1, max: 10 }) };
          case 'api_call':
            return { 
              endpoint: '/api/endpoint/' + faker.datatype.number({ min: 1, max: 100 }), 
              status: faker.helpers.randomize(['success', 'error', 'timeout']) 
            };
          case 'login':
            const methods = ['password', 'oauth', 'sso'];
            return { 
              login_method: faker.helpers.randomize(methods),
              ip_address: faker.internet.ip()
            };
          default:
            return {};
        }
      })();

      const createdAt = faker.date.between(faker.date.recent(90), new Date());
      await db.query(`
        INSERT INTO customer_events (customer_id, event_type, event_data, created_at)
        VALUES ($1, $2, $3, $4)
      `, [customerId, eventType, eventData, createdAt]);
    }
  }
  console.log("4");
  
  // Generate support tickets, with some skew towards "at risk" statuses
  for (let i = 0; i < 50; i++) {
    const customerId = customerIds[Math.floor(Math.random() * customerIds.length)];
    // 60% support tickets are "open" or "pending"
    const statuses = ['open', 'pending', 'open', 'open', 'closed'];
    const status = faker.helpers.randomize(statuses);
    const priorities = ['low', 'medium', 'high'];
    const priority = faker.helpers.randomize(priorities);
    const createdAt = faker.date.past(0.5); // within last 6 months
    await db.query(`
      INSERT INTO support_tickets (customer_id, status, priority, created_at)
      VALUES ($1, $2, $3, $4)
    `, [customerId, status, priority, createdAt]);
  }
  console.log("5");
  
  // Generate invoices with more "at risk" conditions
  for (let i = 0; i < 30; i++) {
    const customerId = customerIds[Math.floor(Math.random() * customerIds.length)];
    const amount = faker.datatype.number({ min: 50, max: 2000, precision: 0.01 });
    const dueDate = faker.date.between(faker.date.recent(90), new Date());

    // 50% unpaid, 30% late, 20% paid
    const rand = Math.random();
    let status, paidDate;

    if (rand < 0.5) {
      status = 'unpaid'; // unpaid
      paidDate = null;
    } else if (rand < 0.8) {
      status = 'late'; // late
      paidDate = null;
    } else {
      status = 'paid'; // paid
      paidDate = faker.date.between(dueDate, new Date());
    }

    await db.query(`
      INSERT INTO invoices (customer_id, amount, due_date, paid_date, status)
      VALUES ($1, $2, $3, $4, $5)
    `, [customerId, amount, dueDate, paidDate, status]);
  }
  console.log("6");
  
  await db.end();
  console.log('Sample data creation complete!');
}

createSampleData().catch(console.error);