import { Customer, CustomerDetail } from '../types/customer';

const customers: Customer[] = [
    { id: 1, name: 'Acme Corp', segment: 'Enterprise', healthScore: 32 },
    { id: 2, name: 'BetaSoft', segment: 'SMB', healthScore: 45 },
    { id: 3, name: 'Cloudify', segment: 'Startup', healthScore: 72 },
    { id: 4, name: 'DevSolutions', segment: 'Enterprise', healthScore: 25 },
    { id: 5, name: 'EcoWare', segment: 'SMB', healthScore: 68 },
    { id: 6, name: 'FinAnalytics', segment: 'Startup', healthScore: 85 },
    { id: 7, name: 'GreenTech', segment: 'Enterprise', healthScore: 39 },
    { id: 8, name: 'HiveMedia', segment: 'SMB', healthScore: 60 },
    { id: 9, name: 'InnoLabs', segment: 'Startup', healthScore: 48 },
    { id: 10, name: 'Jupiter AI', segment: 'Enterprise', healthScore: 91 },
];

const customerDetails: Record<number, CustomerDetail> = {
    1: {
        id: 1,
        name: 'Acme Corp',
        segment: 'Enterprise',
        healthScore: 32,
        loginCount: 12,
        featureAdoption: 20,
        openTickets: 3,
        closedTickets: 5,
        highPriorityOpenTickets: 2,
        lateInvoices: 1,
        totalInvoices: 4,
        apiUsageChange: -15,
    },
    2: {
        id: 2,
        name: 'BetaSoft',
        segment: 'SMB',
        healthScore: 45,
        loginCount: 25,
        featureAdoption: 40,
        openTickets: 1,
        closedTickets: 2,
        highPriorityOpenTickets: 0,
        lateInvoices: 0,
        totalInvoices: 2,
        apiUsageChange: 10,
    },
    3: {
        id: 3,
        name: 'Cloudify',
        segment: 'Startup',
        healthScore: 72,
        loginCount: 45,
        featureAdoption: 65,
        openTickets: 0,
        closedTickets: 3,
        highPriorityOpenTickets: 0,
        lateInvoices: 0,
        totalInvoices: 3,
        apiUsageChange: 5,
    },
    // ... add for other customers if needed
};

export async function fetchCustomers(): Promise<Customer[]> {
    return new Promise(resolve => setTimeout(() => resolve(customers), 300));
}

export async function fetchCustomerDetail(id: number): Promise<CustomerDetail> {
    return new Promise((resolve, reject) =>
        setTimeout(() => {
            if (customerDetails[id]) resolve(customerDetails[id]);
            else reject(new Error('Customer not found'));
        }, 300)
    );
}
 