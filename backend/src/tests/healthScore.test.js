const { calculate } = require('../services/healthScoreService');

test('health score calculation works', () => {
  const fakeCustomer = { login_frequency: 5, feature_adoption: 3, support_tickets: 1 };
  const score = calculate(fakeCustomer);
  expect(score).toBeGreaterThanOrEqual(0);
  expect(score).toBeLessThanOrEqual(100);
});
