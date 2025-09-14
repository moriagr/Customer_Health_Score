export interface Customer {
    id: number;
    name: string;
    segment: string;
    score: number;
};

export interface DashboardSummary {
    "At Risk": number;
    Healthy: number;
    Middle: number;
    total_customers: number;
};

export interface Ticket {
    id: number;
    customer_id: number;
    priority: "low" | "medium" | "high";
    resolved_at: Date | null;
    status: "open" | "closed";
    created_at: Date;
};

export interface Invoice {
    id: number;
    customer_id: number;
    amount: number;
    due_date: Date;
    paid_date: Date | null;
    status: "paid" | "unpaid" | "late";
};

export interface CurrEvent {
    id: number;
    customer_id: number;
    event_type: "login" | "feature_use" | "api_call";
    created_at: Date;
    event_data: any;
};


export type PieData = {
    name: string;
    value: number;
    percentage: string;
};

export interface CurrCustomerDetail extends Customer {
    customerName: string;
    customerSegment: string;
    scores: any;
    featureCount: number;

    invoicePayment?: {
        onTime: number,
        unpaid: number,
        late: number,
        total: number,
    };
    total_features: number;
    // currentMonth: { loginsCurrent, featuresCurrent, apiCurrent },
    // lastMonth: { loginsPrev, featuresPrev, apiPrev },
    ticketsData?: {
        openTickets: number,
        mediumTickets: number,
        highTickets: number,
        closedTickets: number,
        pendingTickets: number
    }
    // score: { total: number, feature: number, login: number, support: number, payment: number, api: number };
    lastMonth?: {
        logins: number;
        features: number;
        apiCalls: number;
    };
    currentMonth?: {
        logins: number;
        features: number;
        apiCalls: number;
    };

    invoices: Invoice[];
    tickets: Ticket[];
    events: CurrEvent[];
    id: number;
};

export interface CustomerDetail extends Customer {
    loginCount: number;
    featureAdoption: number;
    openTickets: number;
    closedTickets: number;
    highPriorityOpenTickets: number;
    lateInvoices: number;
    totalInvoices: number;
    apiUsageChange: number;
}
