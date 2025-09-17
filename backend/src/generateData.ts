import db from './config/db';
import faker from 'faker';

const segments = ['Enterprise', 'SMB', 'Startup'];

const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const twoMonthsAgo = new Date();
twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

async function createSampleData() {
  // 1️⃣ Create segments if they don't exist
  for (const name of segments) {
    await db.query(`
      INSERT INTO segments (name)
      VALUES ($1)
      ON CONFLICT (name) DO NOTHING
    `, [name]);
  }

  const resSegments = await db.query('SELECT * FROM segments');
  const segmentMap: { [key: string]: number } = {};
  resSegments.rows.forEach((row: { name: string; id: number }) => { segmentMap[row.name] = row.id; });

  // 2️⃣ Generate customers
  const customerCount = 50;
  const customerIds: number[] = [];
  for (let i = 0; i < customerCount; i++) {
    const name = faker.company.companyName();
    const segmentName = segments[Math.floor(Math.random() * segments.length)];
    const segmentId = segmentMap[segmentName];
    const createdAt = faker.date.past(2);

    const res = await db.query(`
      INSERT INTO customers (name, segment_id, created_at)
      VALUES ($1, $2, $3)
      RETURNING id
    `, [name, segmentId, createdAt]);

    const customerId = res.rows[0].id;
    customerIds.push(customerId);

    // Decide target category with weighted probability
    const rand = Math.random();
    let targetCategory: 'Healthy' | 'Middle' | 'At Risk';
    if (rand < 0.4) targetCategory = 'At Risk';
    else if (rand < 0.5) targetCategory = 'Middle';
    else targetCategory = 'Healthy';

    // 3️⃣ Generate events biased by category
    await generateEvents(customerId, targetCategory);
  }

  console.log("Customer and events generated.");

  await db.end();
  console.log('Sample data creation complete!');
}

// --- Helper: Generate events biased by target category ---
async function generateEvents(customerId: number, targetCategory: 'Healthy' | 'Middle' | 'At Risk') {
  const eventTypes = ['login', 'feature_use', 'api_call'];
  const totalEvents = 40;

  for (let i = 0; i < totalEvents; i++) {
    const eventType = faker.helpers.randomize(eventTypes);
    let period: 'current' | 'prev';

    // Bias periods based on targetCategory
    switch (targetCategory) {
      case 'Healthy':
        period = Math.random() < 0.7 ? 'current' : 'prev';
        break;
      case 'Middle':
        period = Math.random() < 0.4 ? 'current' : 'prev';
        break;
      case 'At Risk':
        period = Math.random() < 0.2 ? 'current' : 'prev';
        break;
    }

    const createdAt = period === 'current'
      ? faker.date.between(oneMonthAgo, new Date())
      : faker.date.between(twoMonthsAgo, oneMonthAgo);

    let eventData: Record<string, any> = {};

    switch (eventType) {
      case 'login':
        const loginMethods = ['password', 'oauth', 'sso'];
        eventData = {
          login_method: faker.helpers.randomize(loginMethods),
          ip_address: faker.internet.ip(),
        };
        break;

      case 'feature_use':
        eventData = {
          feature: `Feature ${faker.datatype.number({ min: 1, max: 10 })}`,
          duration_seconds: faker.datatype.number({ min: 5, max: 300 }), // optional
        };
        break;

      case 'api_call':
        const statuses = ['success', 'error', 'timeout'];
        eventData = {
          endpoint: `/api/endpoint/${faker.datatype.number({ min: 1, max: 100 })}`,
          status: faker.helpers.randomize(statuses),
          response_time_ms: faker.datatype.number({ min: 50, max: 2000 }), // optional
        };
        break;

      default:
        eventData = {};
    }

    await db.query(`
      INSERT INTO customer_events (customer_id, event_type, event_data, created_at)
      VALUES ($1, $2, $3, $4)
    `, [customerId, eventType, eventData, createdAt]);
  }

  // --- Generate support tickets ---
  const { high, medium, open, closed, pending } = generateSupportTicketsData(targetCategory);
  for (let i = 0; i < high; i++) await insertTicket(customerId, 'open', 'high');
  for (let i = 0; i < medium; i++) await insertTicket(customerId, 'open', 'medium');
  for (let i = 0; i < open; i++) await insertTicket(customerId, 'open', 'low');
  for (let i = 0; i < pending; i++) await insertTicket(customerId, 'pending', 'medium');
  for (let i = 0; i < closed; i++) await insertTicket(customerId, 'closed', 'low');

  // --- Generate invoices ---
  const invoices = generateInvoicesData(targetCategory);
  for (const inv of invoices) {
    await db.query(`
      INSERT INTO invoices (customer_id, amount, due_date, paid_date, status)
      VALUES ($1, $2, $3, $4, $5)
    `, [customerId, inv.amount, inv.due_date, inv.paid_date, inv.status]);
  }
}

// Helper to generate a random boolean with a given probability
function chance(probability: number): boolean {
  return Math.random() < probability;
}

// Helper to generate a random number within a range, possibly zero
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSupportTicketsData(target: string) {
  // Decide whether to generate tickets at all
  const generateTickets = chance(0.8); // 80% chance to generate tickets
  if (!generateTickets) {
    // Possibly no tickets at all
    return { high: 0, medium: 0, open: 0, pending: 0, closed: 0 };
  }

  // Generate total number of tickets randomly
  const totalTickets = getRandomInt(0, 20); // up to 20 tickets

  // Initialize counts
  let high = 0,
    medium = 0,
    open = 0,
    pending = 0,
    closed = 0;

  for (let i = 0; i < totalTickets; i++) {
    // Randomly determine ticket status
    const statusProb = Math.random();

    let status: 'open' | 'pending' | 'closed';

    if (statusProb < 0.5) {
      status = 'open';
    } else if (statusProb < 0.8) {
      status = 'pending';
    } else {
      status = 'closed';
    }

    // Randomly determine priority
    const priorityProb = Math.random();
    let priority: 'high' | 'medium' | 'low';

    if (priorityProb < 0.2) {
      priority = 'high';
    } else if (priorityProb < 0.5) {
      priority = 'medium';
    } else {
      priority = 'low';
    }

    // Count based on status and priority
    if (status === 'open') {
      open++;
    } else if (status === 'pending') {
      pending++;
    } else {
      closed++;
    }

    if (priority === 'high') {
      high++;
    } else if (priority === 'medium') {
      medium++;
    }
    // Low priority is not counted here, but you could extend if needed
  }

  // Optionally, you could also generate some tickets with only certain types
  // For example, sometimes only high priority, or only closed tickets, etc.
  // But for simplicity, the above makes a more random and diverse set.

  return { high, medium, open, pending, closed };
}

function generateInvoicesData(target: string) {
  const invoices = [];
  const count = 3 + Math.floor(Math.random() * 3); // 3-5 invoices
  for (let i = 0; i < count; i++) {
    const amount = faker.datatype.number({ min: 50, max: 2000, precision: 0.01 });
    const due_date = faker.date.between(faker.date.past(3), new Date());
    let status: 'paid' | 'late' | 'unpaid' = 'paid';
    let paid_date: Date | null = faker.date.between(due_date, new Date());

    if (target === 'Middle') {
      status = faker.helpers.randomize(['paid', 'late']);
      if (status === 'late') paid_date = null;
    } else if (target === 'At Risk') {
      status = faker.helpers.randomize(['unpaid', 'late', 'paid']);
      paid_date = null;
    }

    invoices.push({ amount, due_date, status, paid_date });
  }
  return invoices;
}

async function insertTicket(customerId: number, status: string, priority: string) {
  await db.query(`
    INSERT INTO support_tickets (customer_id, status, priority, created_at)
    VALUES ($1, $2, $3, $4)
  `, [customerId, status, priority, faker.date.recent(30)]);
}

// --- Execute ---
createSampleData().catch(console.error);
