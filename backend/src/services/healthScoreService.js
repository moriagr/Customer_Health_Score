// Categorize by thresholds
function categorize(score) {
  if (score < 40) return 'at_risk';
  if (score < 70) return 'medium';
  return 'healthy';
}

// Example health score calculation
function calculate(customer) {
  // Simple fake formula: loginFrequency * featureAdoption - supportTickets
  return Math.max(
    0,
    Math.min(
      100,
      customer.login_frequency * 10 + customer.feature_adoption * 20 - customer.support_tickets * 5
    )
  );
}

function calculateDetailed(customer) {
  return {
    loginFrequency: customer.login_frequency,
    featureAdoption: customer.feature_adoption,
    supportTickets: customer.support_tickets,
    score: calculate(customer),
  };
}

module.exports = { calculate, calculateDetailed, categorize };
