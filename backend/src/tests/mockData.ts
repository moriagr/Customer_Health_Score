const now = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(now.getMonth() - 1);
const twoMonthsAgo = new Date();
twoMonthsAgo.setMonth(now.getMonth() - 2);
const threeMonthsAgo = new Date();
threeMonthsAgo.setMonth(now.getMonth() - 3);

export const mockCustomers = [
    {
        customer_id: 1,
        customer_name: "Alice",
        segment: "Enterprise",
        events: [
            // Login events
            { id: 101, event_type: "login", created_at: now.toISOString() },          // current
            { id: 102, event_type: "login", created_at: oneMonthAgo.toISOString() },  // previous
            { id: 103, event_type: "login", created_at: twoMonthsAgo.toISOString() }, // previous
            { id: 104, event_type: "login", created_at: threeMonthsAgo.toISOString() }, // ignored

            // Feature events
            { id: 105, event_type: "feature_use", created_at: now.toISOString() },      // current
            { id: 106, event_type: "feature_use", created_at: oneMonthAgo.toISOString() }, // previous
            { id: 107, event_type: "feature_use", created_at: twoMonthsAgo.toISOString() }, // previous
            { id: 108, event_type: "feature_use", created_at: threeMonthsAgo.toISOString() }, // ignored

            // API events
            { id: 109, event_type: "api_call", created_at: now.toISOString() },        // current
            { id: 110, event_type: "api_call", created_at: oneMonthAgo.toISOString() },  // previous
            { id: 111, event_type: "api_call", created_at: twoMonthsAgo.toISOString() },  // previous
            { id: 112, event_type: "api_call", created_at: threeMonthsAgo.toISOString() }, // ignored
        ],
        tickets: [
            { id: 201, status: "open", priority: "high", created_at: now.toISOString(), resolved_at: null },
            { id: 202, status: "open", priority: "medium", created_at: oneMonthAgo.toISOString(), resolved_at: null },
            { id: 203, status: "closed", priority: "low", created_at: twoMonthsAgo.toISOString(), resolved_at: now.toISOString() },
            { id: 204, status: "pending", priority: "low", created_at: threeMonthsAgo.toISOString(), resolved_at: null },
        ],
        invoices: [
            { id: 301, amount: 1000, due_date: now.toISOString(), paid_date: now.toISOString(), status: "paid" },  // onTime
            { id: 302, amount: 500, due_date: oneMonthAgo.toISOString(), paid_date: now.toISOString(), status: "paid" }, // late
            { id: 303, amount: 300, due_date: twoMonthsAgo.toISOString(), paid_date: null, status: "unpaid" }, // overdue -> late
            { id: 304, amount: 200, due_date: threeMonthsAgo.toISOString(), paid_date: null, status: "unpaid" }, // overdue -> late
        ],
    },
    {
        customer_id: 2,
        customer_name: "Bob",
        segment: "SMB",
        events: [],   // no events
        tickets: [],  // no tickets
        invoices: [], // no invoices
    },
    {
        customer_id: 3,
        customer_name: "Charlie",
        segment: "SMB",
        events: [
            { id: 301, event_type: "login", created_at: now.toISOString() },
            { id: 302, event_type: "feature_use", created_at: now.toISOString() },
            { id: 303, event_type: "api_call", created_at: now.toISOString() },
        ],
        tickets: [
            { id: 401, status: "open", priority: "low", created_at: oneMonthAgo.toISOString(), resolved_at: null }
        ],
        invoices: [
            { id: 501, amount: 200, due_date: now.toISOString(), paid_date: null, status: "unpaid" } // not due yet
        ],
    }
];
