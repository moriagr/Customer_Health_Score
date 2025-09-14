const {
  calculate,
  calculateDetailed,
  categorize,
  calcLoginAndApiScore,
  calcFeatureAdoption,
  calcSupportScore,
  calcPaymentScore,
  calcFeatureAdoptionScore,
  calculateCustomerScore
} = require('../services/healthScoreService');

// Helper for generating dummy invoices
const createInvoices = (arr) => arr.map(([due, paid]) => ({ due_date: due, paid_date: paid }));

describe('Score Utilities', () => {

  describe('categorize()', () => {
    it('returns At Risk for score <50', () => {
      expect(categorize(20)).toBe('At Risk');
    });
    it('returns Middle for score <75', () => {
      expect(categorize(60)).toBe('Middle');
    });
    it('returns Healthy for score >=75', () => {
      expect(categorize(90)).toBe('Healthy');
    });
  });

  describe('calcFeatureAdoption()', () => {
    it('calculates percentage correctly', () => {
      const features = new Set([1,2,3]);
      expect(calcFeatureAdoption(features, 6)).toBe(50);
    });
    it('handles zero totalFeatures', () => {
      const features = new Set([1,2]);
      expect(calcFeatureAdoption(features, 0)).toBe(0);
    });
  });

  describe('calcLoginAndApiScore()', () => {
    it('returns 0 if current month = 0', () => {
      expect(calcLoginAndApiScore(0, 5)).toBe(0);
    });
    it('returns 100 if previous month = 0', () => {
      expect(calcLoginAndApiScore(5, 0)).toBe(100);
    });
    it('returns correct percentage', () => {
      expect(calcLoginAndApiScore(8, 4)).toBe(100); // capped at 100
      expect(calcLoginAndApiScore(2, 4)).toBe(50);
    });
  });

  describe('calcSupportScore()', () => {
    it('returns 100 if no tickets', () => {
      expect(calcSupportScore(0,0,0,0,0)).toBe(100);
    });
    it('calculates weighted score', () => {
      const score = calcSupportScore(1,2,1,0,1);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('calcPaymentScore()', () => {
    it('returns 100 if no invoices', () => {
      expect(calcPaymentScore([]).score).toBe(100);
    });

    it('calculates onTime, late, unpaid correctly', () => {
      const invoices = createInvoices([
        ['2025-09-01', '2025-08-30'], // onTime
        ['2025-09-01', '2025-09-02'], // late
        ['2025-12-01', null],         // unpaid, not due
        ['2025-08-01', null],         // unpaid, overdue -> late
      ]);
      const result = calcPaymentScore(invoices);
      expect(result.onTime).toBe(1);
      expect(result.late).toBe(2);
      expect(result.unpaid).toBe(1);
      expect(result.score).toBeCloseTo(25);
      expect(result.total).toBe(4);
    });
  });

  describe('calcFeatureAdoptionScore()', () => {
    it('returns 100 if previous month =0 and current >0', () => {
      expect(calcFeatureAdoptionScore(5,0)).toBe(100);
    });
    it('returns 0 if previous month =0 and current =0', () => {
      expect(calcFeatureAdoptionScore(0,0)).toBe(0);
    });
    it('calculates correct change', () => {
      expect(calcFeatureAdoptionScore(6, 4)).toBe(100); // capped at 100
      expect(calcFeatureAdoptionScore(2, 4)).toBe(50);
    });
  });

  describe('calculate()', () => {
    it('returns weighted total correctly', () => {
      const result = calculate({ featureScore: 100, loginScore: 50, supportScore: 80, paymentScore: 90, apiScore: 60 });
      expect(result.total).toBeDefined();
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.total).toBeLessThanOrEqual(100);
      expect(result.featureScore).toBe(100);
    });
  });

  describe('calculateCustomerScore()', () => {
    it('calculates detailed customer score', () => {
      const customer = {
        tickets: [
          { status: 'open', priority: 'low' },
          { status: 'open', priority: 'medium' },
          { status: 'closed' },
          { status: 'pending' }
        ],
        invoices: createInvoices([['2025-08-01', '2025-08-01'], ['2025-09-01', null]]),
        events: [
          { event_type: 'login', created_at: new Date().toISOString() },
          { event_type: 'feature_use', created_at: new Date().toISOString() },
          { event_type: 'api_call', created_at: new Date().toISOString() },
        ],
        total_features: 10
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

  describe('calculateDetailed()', () => {
    it('returns all customer data plus detailed scores', () => {
      const customer = {
        customer_name: 'TestCo',
        segment: 'SMB',
        customer_id: 1,
        tickets: [],
        invoices: [],
        events: [],
      };
      const detailed = calculateDetailed(customer);
      expect(detailed.customerName).toBe('TestCo');
      expect(detailed.customerSegment).toBe('SMB');
      expect(detailed.scores).toBeDefined();
      expect(detailed.events).toBeDefined();
      expect(detailed.tickets).toBeDefined();
      expect(detailed.invoices).toBeDefined();
    });
  });

});
