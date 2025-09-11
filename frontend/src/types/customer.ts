export interface Customer {
  id: number;
  name: string;
  segment: string;
  healthScore: number;
}

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
