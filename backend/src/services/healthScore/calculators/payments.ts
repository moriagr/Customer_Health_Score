import { Invoice } from "../../../type/healthScoreType";
import {logger} from "../../../utils/logger";

export function calcPaymentScore(invoices: Invoice[]) {
    if (!invoices || invoices.length === 0) {
        const result = { onTime: 0, late: 0, unpaid: 0, score: 100, total: 0 };
        logger.info("No invoices found, default payment score applied", result);
        return result;
    }

    let onTime = 0, late = 0, unpaid = 0;
    const now = new Date();

    invoices.forEach(inv => {
        const dueDate = new Date(inv.due_date);
        if (inv.paid_date) {
            const paidDate = new Date(inv.paid_date);
            if (paidDate <= dueDate) onTime++;
            else late++;
        } else {
            if (dueDate < now) late++; // overdue unpaid
            else unpaid++; // not due yet
        }
    });

    const totalInvoices = invoices.length;
    const score = totalInvoices > 0 ? (onTime / totalInvoices) * 100 : 100;

    const result = { onTime, late, unpaid, score, total: totalInvoices };
    logger.info("Calculated payment score", result);
    return result;
}
