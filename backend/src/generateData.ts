import db from './config/db'
import faker from 'faker'


async function createSampleData() {

  // Create segments if not exist
  const segments = ['Enterprise', 'SMB', 'Startup'];
  for (const name of segments) {
    await db.query(`
      INSERT INTO segments (name)
      VALUES ($1)
      ON CONFLICT (name) DO NOTHING
    `, [name]);
  }

  console.log("1");
  // Fetch segment IDs
  const resSegments = await db.query('SELECT * FROM segments');
  const segmentMap: { [key: string]: number } = {};
  resSegments.rows.forEach((row: { name: string; id: number }) => { segmentMap[row.name] = row.id; });
  console.log("2");
  // Generate customers
  const customerCount = 50;
  const customerIds = [];
  for (let i = 0; i < customerCount; i++) {
    const name = faker.company.companyName();
    const segmentName = segments[Math.floor(Math.random() * segments.length)];
    const segmentId = segmentMap[segmentName];
    const createdAt = faker.date.past(2); // within last 2 years
    const totalFeatures = Math.floor(Math.random() * (15 - 5 + 1)) + 5;

    const res = await db.query(`
      INSERT INTO customers (name, segment_id, created_at, total_features)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, [name, segmentId, createdAt, totalFeatures]);
    customerIds.push(res.rows[0].id);

  }
  console.log("3");
  // Generate customer events over last 3 months
  const eventTypes = ['login', 'feature_use', 'api_call'];
  for (const customerId of customerIds) {
    const eventCount = Math.floor(Math.random() * 20) + 10; // 10-30 events
    for (let i = 0; i < eventCount; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const eventData = (() => {
        if (eventType === 'feature_use') {
          return { feature: 'Feature ' + faker.datatype.number({ min: 1, max: 10 }) };
        } else if (eventType === 'api_call') {
          return { endpoint: '/api/endpoint/' + faker.datatype.number({ min: 1, max: 100 }) };
        } else {
          return { login_method: 'password' };
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
  // Generate support tickets
  for (let i = 0; i < 50; i++) {
    const customerId = customerIds[Math.floor(Math.random() * customerIds.length)];
    const statuses = ['open', 'closed', 'pending'];
    const priorities = ['low', 'medium', 'high'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const createdAt = faker.date.past(0.5); // within last 6 months
    await db.query(`
      INSERT INTO support_tickets (customer_id, status, priority, created_at)
      VALUES ($1, $2, $3, $4)
    `, [customerId, status, priority, createdAt]);
  }
  console.log("5");
  // Generate invoices
  for (let i = 0; i < 30; i++) {
    const customerId = customerIds[Math.floor(Math.random() * customerIds.length)];
    const amount = (faker.datatype.number({ min: 50, max: 2000, precision: 0.01 })).toFixed(2);
    const dueDate = faker.date.between(faker.date.recent(90), new Date());
    const isPaid = Math.random() < 0.7;
    const paidDate = isPaid ? faker.date.between(dueDate, new Date()) : null;
    const statuses = ['unpaid', 'paid', 'late'];
    const status = isPaid ? 'paid' : (Math.random() < 0.3 ? 'late' : 'unpaid');

    await db.query(`
      INSERT INTO invoices (customer_id, amount, due_date, paid_date, status)
      VALUES ($1, $2, $3, $4, $5)
    `, [customerId, amount, dueDate, paidDate, status]);
  }
  console.log("6)");
  await db.end();
  console.log('Sample data creation complete!');
}

createSampleData().catch(console.error);
