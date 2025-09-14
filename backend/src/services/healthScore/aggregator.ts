import { Customer, typeCalculate } from "../../type/healthScoreType";
import { calcScore } from "./calculators/featureAdoption";
import { convertIntoCurrentAndPrev } from "./calculators/loginAndApi";
import { separateSupportTickets, calcSupportScore } from "./calculators/support";
import { calcPaymentScore } from "./calculators/payments";

export function calculate({ featureScore, loginScore, supportScore, paymentScore, apiScore }: typeCalculate) {
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

export function calculateCustomerScore(customer: Customer) {
    const { loginsCurrent, loginsPrev, apiPrev, apiCurrent, featuresCurrent, featuresPrev } = convertIntoCurrentAndPrev(customer.events);
    const { highTickets, mediumTickets, openTickets, closedTickets, pendingTickets } = separateSupportTickets(customer.tickets);

    const loginScore = calcScore(loginsCurrent, loginsPrev);
    const featureScore = calcScore(featuresCurrent, featuresPrev);
    const apiScore = calcScore(apiCurrent, apiPrev);
    const supportScore = calcSupportScore(openTickets, mediumTickets, highTickets, closedTickets, pendingTickets);
    const payment = calcPaymentScore(customer.invoices);

    const scores = calculate({
        featureScore,
        loginScore,
        supportScore,
        paymentScore: payment.score,
        apiScore,
    });

    return {
        score: scores.total,
        scores,
        currentMonth: { logins: loginsCurrent, features: featuresCurrent, apiCalls: apiCurrent },
        lastMonth: { logins: loginsPrev, features: featuresPrev, apiCalls: apiPrev },
        ticketsData: { openTickets, mediumTickets, highTickets, closedTickets, pendingTickets },
        invoicePayment: payment,
        total_features: customer.total_features || 0,
    };
}

export function calculateDetailed(customer: Customer) {
    const detailedScores = calculateCustomerScore(customer);
    return {
        events: customer.events,
        invoices: customer.invoices,
        tickets: customer.tickets,
        customerName: customer.customer_name,
        customerSegment: customer.segment,
        id: customer.customer_id,
        ...detailedScores,
    };
}
