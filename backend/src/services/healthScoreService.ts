// 1. Feature Adoption (30%)

import { Customer, typeCalculate } from "../type/healthScoreType";

// Categorize by thresholds
function categorize(score: number | string) {
    if (Number(score) < 50) return 'At Risk';
    if (Number(score) < 75) return 'Middle';
    return 'Healthy';
}

function calcFeatureAdoption(features: Set<any>, totalFeatures = 10) {
    if (Number(totalFeatures) === 0) return 0;
    return (features.size / Number(totalFeatures)) * 100;
}

// 2. Login Frequency (25%) & 5. API Usage (10%)
function calcLoginAndApiScore(currentMonthData: number, previousMonthData: number) {

    if (currentMonthData === 0) return 0;
    if (previousMonthData === 0) return 100;

    return Math.min(100, (currentMonthData / previousMonthData) * 100);
}

// 3. Support Tickets (20%)
// function calcSupportScore(highTickets, openTickets, mediumTickets) {
//     let score = 100 - (openTickets * 5 + mediumTickets * 2 + highTickets * 1);
//     return Math.max(0, Math.min(100, score));
// }
function calcSupportScore(open: number, medium: number, high: number, closed: number, pending: number) {
    const total = open + medium + high + closed + pending;
    if (total === 0) return 100;

    const weightedOpen = open * 1;
    const weightedMedium = medium * 2;
    const weightedHigh = high * 5;
    const weightedPending = pending * 1;

    const issueScore = (weightedOpen + weightedMedium + weightedHigh + weightedPending) / total;
    return Math.max(0, 100 - issueScore * 20); // 20 = scaling factor
}


// 4. Payment Timeliness (15%)
function calcPaymentScore(invoices: Array<{ due_date: string; paid_date?: string }>) {
    if (!invoices || invoices.length === 0) {
        return {
            onTime: 0,
            late: 0,
            unpaid: 0,
            score: 100,
            total: 0,
        };
    }

    let onTime = 0;
    let late = 0;
    let unpaid = 0;

    const now = new Date();

    invoices.forEach(inv => {
        const dueDate = new Date(inv.due_date);
        if (inv.paid_date) {
            const paidDate = new Date(inv.paid_date);
            if (paidDate <= dueDate) {
                onTime++;
            } else {
                late++;
            }
        } else {
            // unpaid invoice
            if (dueDate < now) {
                late++; // overdue unpaid counts as late
            } else {
                unpaid++; // not due yet
            }
        }
    });

    const totalInvoices = invoices.length;
    const score = totalInvoices > 0 ? (onTime / totalInvoices) * 100 : 100;

    return {
        onTime,
        late,
        unpaid,
        score,
        total: totalInvoices,
    };
}

// 5. API Usage (10%)
function calcFeatureAdoptionScore(currentMonthFeatures: number, previousMonthFeatures: number) {
    if (previousMonthFeatures === 0) return currentMonthFeatures > 0 ? 100 : 0;
    const change = (currentMonthFeatures - previousMonthFeatures) / previousMonthFeatures;
    let score = 100 * Math.max(0, Math.min(1, 1 + change));
    return score;
}

// Final Weighted Score
function calculate({
    featureScore,
    loginScore,
    supportScore,
    paymentScore,
    apiScore,
}: typeCalculate) {

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
        total: Number(total.toFixed(1)),
    };
}


function calculateCustomerScore(customer: Customer) {
    try {

        let loginsCurrent = 0, loginsPrev = 0;

        let featuresCurrent = 0, featuresPrev = 0;

        let openTickets = 0, mediumTickets = 0, highTickets = 0, closedTickets = 0, pendingTickets = 0;

        let apiCurrent = 0, apiPrev = 0;
        customer.tickets.forEach((ticket) => {
            if (ticket.status === "open") {
                if (ticket.priority === "high") {
                    highTickets += 1;
                } else if (ticket.priority === "medium") {
                    mediumTickets += 1;
                } else {
                    openTickets += 1;
                }
            } else if (ticket.status === "closed") {
                closedTickets += 1;
            } else if (ticket.status === "pending") {
                pendingTickets += 1;
            }
        });

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        customer.events.forEach((event) => {
            const eventDate = new Date(event.created_at);
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
        const featureScore = calcLoginAndApiScore(featuresCurrent, featuresPrev);
        const supportScore = calcSupportScore(highTickets, openTickets, mediumTickets, closedTickets, pendingTickets);
        const apiScore = calcLoginAndApiScore(apiCurrent, apiPrev);
        const paymentScore = calcPaymentScore(customer.invoices);
        const scores = calculate({
            featureScore, loginScore, supportScore, paymentScore: paymentScore.score, apiScore
        });

        return {
            score: scores.total,
            scores,
            currentMonth: { logins: loginsCurrent, features: featuresCurrent, apiCalls: apiCurrent },
            lastMonth: { logins: loginsPrev, features: featuresPrev, apiCalls: apiPrev },
            ticketsData: { openTickets, mediumTickets, highTickets, closedTickets, pendingTickets },
            invoicePayment: {
                onTime: paymentScore.onTime || 0,
                unpaid: paymentScore.unpaid || 0,
                late: paymentScore.late || 0,
                total: paymentScore.total || 0
            },
            total_features: customer.total_features || 0
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Error calculating customer score: " + error.message);
        } else {
            throw new Error("Error calculating customer score: " + String(error));
        }
    }
}

function calculateDetailed(customer: Customer) {
    try {

        const detailedScores = calculateCustomerScore(customer);
        return {
            events: customer.events,
            invoices: customer.invoices,
            tickets: customer.tickets,
            customerName: customer.customer_name,
            customerSegment: customer.segment,
            id: customer.customer_id,
            ...detailedScores,
            // score: calculateCustomerScore(customer).total,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Error in calculateDetailed: " + error.message);
        } else {
            throw new Error("Error in calculateDetailed: " + String(error));
        }
    }
}

module.exports = { calculate, calculateCustomerScore, calculateDetailed, categorize, calcLoginAndApiScore, calcFeatureAdoption, calcSupportScore, calcPaymentScore, calcFeatureAdoptionScore };
