import { Customer, CustomerDetail } from '../types/customer';

const API_BASE = 'http://localhost:8000/api';

export async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch(`${API_BASE}/customers`);
  return res.json();
}

export async function fetchCustomerDetail(id: number): Promise<CustomerDetail> {
  const res = await fetch(`${API_BASE}/customers/${id}/health`);
  return res.json();
}
