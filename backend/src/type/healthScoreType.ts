
export type Invoice = { amount: number; due_date: Date; paid_date: Date | null; status: string };

export type CustomerRow = {
    customer_id: number;
    customer_name: string;
    total_features: number;
    // pendingTickets: number;

    segment: string;

    event_id: number | null;
    event_type: string | null;
    event_created_at: Date;

    ticket_id: number | null;
    ticket_status: string | null;
    ticket_priority: string | null;
    ticket_created_at: Date | null;
    ticket_resolved_at: Date | null;

    invoice_id: number | null;
    invoice_amount: number | null;
    invoice_due_date: Date | null;
    invoice_paid_date: Date | null;
    invoice_status: string | null;
};

export type customerMapType = {
    loginsCurrent: number;
    loginsPrev: number;
    total_features: number;
    pendingTickets: number;

    featuresCurrent: number;
    featuresPrev: number;

    openTickets: number;
    mediumTickets: number;
    highTickets: number;
    closedTickets: number;

    apiCurrent: number;
    apiPrev: number;

    invoices: Invoice[];
    name: string;
    segment: string
}

export type partCustomer = {
    id: number;
    score: number;
    category?: string;
    invoices: Invoice[];
    name: string;
    segment: string
}


export type typeCalculate = {
    featureScore: number;
    loginScore: number;
    supportScore: number;
    paymentScore: number;
    apiScore: number;
}

export interface Customer {
    customer_id: string;
    customer_name: string;
    segment: string;
    total_features?: number;
    events: Array<{
        created_at: string;
        event_type: string;
    }>;
    invoices: Array<{
        due_date: string;
        paid_date?: string;
    }>;
    tickets: Array<{
        status: string;
        priority: string;
    }>;
}