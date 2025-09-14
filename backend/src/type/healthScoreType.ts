
export type Invoice = {
    amount: number;
    due_date: Date;
    paid_date: Date | null;
    status: string
};

export interface Customer {
    customer_id: number;
    customer_name: string;
    segment: string;
    total_features?: number;
    events: currEvent[];
    invoices: Invoice[];
    tickets: Ticket[];
}


export type currEvent = {
    created_at: Date;
    event_type: string;
    event_data?: string;
    id: number;
}

export type Ticket = {
    id: number;
    created_at: Date;
    resolved_at?: Date | null;
    status: string;
    priority: string;
}

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

