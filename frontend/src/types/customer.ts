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

export interface CurrCustomerDetail extends Customer {
    customerName: string;
    customerSegment: string;
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
