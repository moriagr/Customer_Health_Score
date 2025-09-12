// 1. Feature Adoption (30%)
function calcFeatureAdoption(features, totalFeatures = 10) {
  if (totalFeatures === 0) return 0;
  return (features.size / totalFeatures) * 100;
}
// Categorize by thresholds
function categorize(score) {
  if (Number(score) < 50) return 'At Risk';
  if (Number(score) < 75) return 'Middle';
  return 'Healthy';
}

// 2. Login Frequency (25%) & 5. API Usage (10%)
function calcLoginAndApiScore(currentMonthLogins, previousMonthLogins) {

  if (currentMonthLogins === 0) return 0;
  if (previousMonthLogins === 0) return 100;

  return Math.min(100, (currentMonthLogins / previousMonthLogins) * 100);
}

// 3. Support Tickets (20%)
function calcSupportScore(highTickets, openTickets, mediumTickets) {
  let score = 100 - (openTickets * 5 + mediumTickets * 2 + highTickets * 1);
  return Math.max(0, Math.min(100, score));
}

// 4. Payment Timeliness (15%)
function calcPaymentScore(invoices) {
  if (invoices.length === 0) return 100;

  let onTime = 0;
  invoices.forEach(inv => {
    if (inv.paid_date && new Date(inv.paid_date) <= new Date(inv.due_date)) {
      onTime++;
    }
  });

  return (onTime / invoices.length) * 100;
}

// 5. API Usage (10%)
function calcFeatureAdoptionScore(currentMonthFeatures, previousMonthFeatures) {
  if (previousMonthFeatures === 0) return currentMonthFeatures > 0 ? 100 : 0;
  const change = (currentMonthFeatures - previousMonthFeatures) / previousMonthFeatures;
  let score = 100 * Math.max(0, Math.min(1, 1 + change));
  return score;
}

// Final Weighted Score
function calculate({ featureScore, loginScore, supportScore, paymentScore, apiScore }) {

  const total =
    featureScore * 0.30 +
    loginScore * 0.25 +
    supportScore * 0.20 +
    paymentScore * 0.15 +
    apiScore * 0.10;

  return {
    featureScore,
    loginScore,
    supportScore,
    paymentScore,
    apiScore,
    total: total.toFixed(1),
  };
}


// // Example health score calculation
// function calculate(customer) {
//   const login_frequency = [];
//   const feature_adoption = [];
//   const support_tickets = [];
//   const payment_history = [];
//   const api_usage = [];
//   customer.forEach(element => {
//     if (element.event_type)
//   });
//   let score = 0;
//   return score;
// }

function calculateDetailed(customer) {
  
  return {
    events: customer.events,
    featureAdoption: customer.feature_adoption,
    supportTickets: customer.support_tickets,
    customerName: customer.customer_name,
    customerSegment: customer.segment,
    customerId: customer.customer_id,
    score: calculate(customer),
  };
}

module.exports = { calculate, calculateDetailed, categorize, calcLoginAndApiScore, calcFeatureAdoption, calcSupportScore, calcPaymentScore, calcFeatureAdoptionScore };
