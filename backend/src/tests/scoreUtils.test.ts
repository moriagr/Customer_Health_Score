import {
  // calcFeatureAdoption,
  calcScore,
  convertIntoCurrentAndPrev,
  separateSupportTickets,
  calcSupportScore,
  calculate,
  calcPaymentScore,
  calculateCustomerScore,
  categorize,
  calculateDetailed
} from "../services/healthScore";
import { currEvent, Ticket } from "../type/healthScoreType";

// ✅ Helper for generating dummy invoices (with correct type)
const createInvoices = (arr: [Date, Date | null, number, string][]) =>
  arr.map(([due, paid, amount, status], idx) => ({
    id: idx + 1,
    due_date: due,
    paid_date: paid,
    amount,
    status
  }));

// ✅ Helper for generating dummy tickets
const createTickets = (arr: [string, string, Date, Date | null][]) =>
  arr.map(([status, priority, created, resolved], idx) => ({
    id: idx + 1,
    status,
    priority,
    created_at: created,
    resolved_at: resolved
  }));

// ✅ Helper for generating dummy events
const createEvents = (arr: [string, Date][]) =>
  arr.map(([type, date], idx) => ({
    id: idx + 1,
    event_type: type,
    created_at: date
  }));

describe('convertIntoCurrentAndPrev', () => {
  it('correctly calculates current and previous counts for login, feature, and api', () => {
    const now = new Date("2025-09-14T10:00:00Z");
    const oneMonthAgo = new Date("2025-08-14T10:00:00Z");
    const twoMonthsAgo = new Date("2025-07-14T10:00:00Z");
    const threeMonthsAgo = new Date("2025-06-14T10:00:00Z");


    const events: currEvent[] = [
      { id: 1, event_type: 'login', created_at: now },       // current login
      { id: 2, event_type: 'login', created_at: oneMonthAgo }, // previous login
      { id: 3, event_type: 'feature_use', created_at: now },  // current feature
      { id: 4, event_type: 'feature_use', created_at: twoMonthsAgo }, // previous feature
      { id: 5, event_type: 'api_call', created_at: now },     // current API
      { id: 6, event_type: 'api_call', created_at: twoMonthsAgo }, // previous API
      { id: 7, event_type: 'login', created_at: threeMonthsAgo }, // previous login
      { id: 8, event_type: 'login', created_at: twoMonthsAgo }, // previous login
      { id: 9, event_type: 'feature_use', created_at: threeMonthsAgo },  // current feature
      { id: 10, event_type: 'feature_use', created_at: oneMonthAgo }, // previous feature
      { id: 11, event_type: 'api_call', created_at: threeMonthsAgo },     // current API
      { id: 12, event_type: 'api_call', created_at: oneMonthAgo }, // previous API
    ];

    const result = convertIntoCurrentAndPrev(events);

    expect(result.loginsCurrent).toBe(1);
    // expect(result.loginsCurrent).toBe(2);
    expect(result.loginsPrev).toBe(1);
    expect(result.featuresCurrent).toBe(1);
    expect(result.featuresPrev).toBe(1);
    expect(result.apiCurrent).toBe(1);
    expect(result.apiPrev).toBe(1);
  });
});


describe('separateSupportTickets', () => {
  it('correctly calculates separate support tickets', () => {

    const mockTickets: Ticket[] = [
      {
        id: 101,
        created_at: new Date("2025-09-01T09:00:00Z"),
        resolved_at: new Date("2025-09-02T10:30:00Z"),
        status: "closed",
        priority: "low",
      },
      {
        id: 102,
        created_at: new Date("2025-09-05T11:15:00Z"),
        resolved_at: null,
        status: "open",
        priority: "high",
      },
      {
        id: 103,
        created_at: new Date("2025-09-07T14:00:00Z"),
        resolved_at: null,
        status: "pending",
        priority: "medium",
      },
      {
        id: 104,
        created_at: new Date("2025-09-10T08:30:00Z"),
        resolved_at: new Date("2025-09-12T12:00:00Z"),
        status: "closed",
        priority: "high",
      },
      {
        id: 105,
        created_at: new Date("2025-09-11T15:45:00Z"),
        resolved_at: null,
        status: "open",
        priority: "medium",
      },
      {
        id: 106,
        created_at: new Date("2025-09-12T10:00:00Z"),
        resolved_at: null,
        status: "open",
        priority: "low",
      }
    ];


    const result = separateSupportTickets(mockTickets);

    expect(result.highTickets).toBe(1);
    expect(result.mediumTickets).toBe(1);
    expect(result.openTickets).toBe(1);
    expect(result.closedTickets).toBe(2);
    expect(result.pendingTickets).toBe(1);

    const score = calcSupportScore(result.openTickets, result.mediumTickets, result.highTickets, result.closedTickets, result.pendingTickets)
    expect(score).toBe(55);
  });
});

describe("Score Utilities", () => {
  describe("categorize()", () => {
    it("returns At Risk for score <50", () => {
      expect(categorize(20)).toBe("At Risk");
    });
    it("returns Middle for score <75", () => {
      expect(categorize(60)).toBe("Middle");
    });
    it("returns Healthy for score >=75", () => {
      expect(categorize(90)).toBe("Healthy");
    });
  });

  describe("calcScore()", () => {
    it("returns 0 if current = 0", () => {
      expect(calcScore(0, 5)).toBe(0);
    });
    it("returns 100 if previous = 0", () => {
      expect(calcScore(5, 0)).toBe(100);
    });
    it("returns correct percentage capped at 100", () => {
      expect(calcScore(8, 4)).toBe(100); // capped
      expect(calcScore(2, 4)).toBe(50);
    });
  });

  describe("calcSupportScore()", () => {
    it("returns 100 if no tickets", () => {
      expect(calcSupportScore(0, 0, 0, 0, 0)).toBe(100);
    });
    it("calculates weighted score", () => {
      const score = calcSupportScore(1, 2, 1, 0, 1);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe("calcPaymentScore()", () => {
    it("returns 100 if no invoices", () => {
      expect(calcPaymentScore([]).score).toBe(100);
    });

    it("calculates onTime, late, unpaid correctly", () => {
      const invoices = createInvoices([
        [new Date("2025-09-01"), new Date("2025-08-30"), 100, "paid"], // onTime
        [new Date("2025-09-01"), new Date("2025-09-02"), 200, "paid"], // late
        [new Date("2025-12-01"), null, 150, "unpaid"], // unpaid, not due yet
        [new Date("2025-08-01"), null, 300, "unpaid"], // unpaid, overdue -> late
      ]);
      const result = calcPaymentScore(invoices);
      expect(result.onTime).toBe(1);
      expect(result.late).toBe(2);
      expect(result.unpaid).toBe(1);
      expect(result.score).toBeCloseTo(25);
      expect(result.total).toBe(4);
    });
  });

  describe("calculate()", () => {
    it("returns weighted total correctly", () => {
      const result = calculate({
        featureScore: 100,
        loginScore: 50,
        supportScore: 80,
        paymentScore: 90,
        apiScore: 60,
      });
      expect(result.total).toBeDefined();
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.total).toBeLessThanOrEqual(100);
      expect(result.featureScore).toBe(100);
    });
  });

  describe("calculateCustomerScore()", () => {
    it("calculates detailed customer score", () => {
      const customer = {
        customer_id: 1,
        customer_name: "TestCustomer",
        segment: "Enterprise",
        tickets: createTickets([
          ["open", "low", new Date(), null],
          ["open", "medium", new Date(), null],
          ["closed", "low", new Date(), new Date()],
          ["pending", "high", new Date(), null],
        ]),
        invoices: createInvoices([
          [new Date("2025-08-01"), new Date("2025-08-01"), 120, "paid"],
          [new Date("2025-09-01"), null, 80, "unpaid"],
        ]),
        events: createEvents([
          ["login", new Date()],
          ["feature_use", new Date()],
          ["api_call", new Date()],
        ]),
      };

      const result = calculateCustomerScore(customer);
      expect(result.score).toBeDefined();
      expect(result.ticketsData.openTickets).toBe(1);
      expect(result.ticketsData.mediumTickets).toBe(1);
      expect(result.ticketsData.closedTickets).toBe(1);
      expect(result.ticketsData.pendingTickets).toBe(1);
      expect(result.invoicePayment.total).toBe(2);
      expect(result.currentMonth.logins).toBe(1);
      expect(result.currentMonth.features).toBe(1);
      expect(result.currentMonth.apiCalls).toBe(1);
    });
  });

  describe("calculateDetailed()", () => {
    it("returns all customer data plus detailed scores", () => {
      const customer = {
        customer_id: 2,
        customer_name: "TestCo",
        segment: "SMB",
        tickets: [],
        invoices: [],
        events: [],
      };
      const detailed = calculateDetailed(customer);
      expect(detailed.customerName).toBe("TestCo");
      expect(detailed.customerSegment).toBe("SMB");
      expect(detailed.scores).toBeDefined();
      expect(detailed.events).toBeDefined();
      expect(detailed.tickets).toBeDefined();
      expect(detailed.invoices).toBeDefined();
    });
  });
});
