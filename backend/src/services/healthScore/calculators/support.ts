import { Ticket } from "../../../type/healthScoreType";

export function calcSupportScore(open: number, medium: number, high: number, closed: number, pending: number): number {
    const total = open + medium + high + closed + pending;
    if (total === 0) return 100;

    const weightedOpen = open * 1;
    const weightedMedium = medium * 2;
    const weightedHigh = high * 5;
    const weightedPending = pending * 1;

    const issueScore = (weightedOpen + weightedMedium + weightedHigh + weightedPending) / total;
    return Math.max(0, 100 - issueScore * 20); // scaling factor
}

export function separateSupportTickets(tickets: Ticket[]) {
    let highTickets = 0, mediumTickets = 0, openTickets = 0, closedTickets = 0, pendingTickets = 0;

    tickets.forEach((ticket) => {
        if (ticket.status === "open") {
            if (ticket.priority === "high") highTickets += 1;
            else if (ticket.priority === "medium") mediumTickets += 1;
            else openTickets += 1;
        } else if (ticket.status === "closed") {
            closedTickets += 1;
        } else if (ticket.status === "pending") {
            pendingTickets += 1;
        }
    });

    return { highTickets, mediumTickets, openTickets, closedTickets, pendingTickets };
}
