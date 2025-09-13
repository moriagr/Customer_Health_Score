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
        total: total.toFixed(1) | 0.0,
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

function calculateCustomerScore(customer) {
    try {

        let loginsCurrent = 0, loginsPrev = 0;

        let featuresCurrent = 0, featuresPrev = 0;

        let openTickets = 0, mediumTickets = 0, highTickets = 0, closedTickets = 0;

        let apiCurrent = 0, apiPrev = 0;
        customer.tickets.forEach((ticket) => {
            if (ticket.ticket_id) {
                if (ticket.ticket_status === "open") {
                    if (ticket.ticket_priority === "high") {
                        highTickets += 1;
                    } else if (ticket.ticket_priority === "medium") {
                        mediumTickets += 1;
                    } else {
                        openTickets += 1;
                    }
                } else if (ticket.ticket_status === "closed") {
                    closedTickets += 1;
                }
            }
        });

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        customer.events.forEach((event) => {
            const eventDate = new Date(event.event_created_at);

            if (event.event_type === "login") {
                if (eventDate >= oneMonthAgo) loginsCurrent += 1;
                else if (eventDate >= twoMonthsAgo) loginsPrev += 1;
            } else if (event.event_type === "feature_use") {
                if (eventDate >= oneMonthAgo) featuresCurrent += 1;
                else if (eventDate >= twoMonthsAgo) featuresPrev += 1;
            } else if (event.event_type === "api_call") {
                if (eventDate >= oneMonthAgo) apiCurrent += 1;
                else if (eventDate >= twoMonthsAgo) apiPrev += 1;
            }
        });
        const loginScore = calcLoginAndApiScore(loginsCurrent, loginsPrev);
        const featureScore = calcFeatureAdoptionScore(featuresCurrent, featuresPrev);
        const supportScore = calcSupportScore(highTickets, openTickets, mediumTickets);
        const apiScore = calcLoginAndApiScore(apiCurrent, apiPrev);
        const paymentScore = calcPaymentScore(customer.invoices);
        return calculate({
            featureScore, loginScore, supportScore, paymentScore, apiScore
        });
    } catch (error) {
        throw new Error("Error calculating customer score: " + error.message);
    }
}

function calculateDetailed(customer) {
    try {

        return {
            events: customer.events,
            invoices: customer.invoices,
            tickets: customer.tickets,
            customerName: customer.customer_name,
            customerSegment: customer.segment,
            id: customer.customer_id,
            score: calculateCustomerScore(customer).total,
        };
    } catch (error) {
        throw new Error("Error in calculateDetailed: " + error.message);
    }
}

module.exports = { calculate, calculateDetailed, categorize, calcLoginAndApiScore, calcFeatureAdoption, calcSupportScore, calcPaymentScore, calcFeatureAdoptionScore };
