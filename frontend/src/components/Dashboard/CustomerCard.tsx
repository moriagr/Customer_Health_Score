import React, { useEffect, useState } from 'react';
import { fetchCustomerDetail } from '../../services/customerApi';
import { CustomerDetail as CustomerDetailType } from '../../types/customer';
import { Card } from '../UI/Card';

interface Props {
  customerId: number;
  onBack: () => void;
}

export const CustomerDetail: React.FC<Props> = ({ customerId, onBack }) => {
  const [customer, setCustomer] = useState<CustomerDetailType | null>(null);

  useEffect(() => {
    fetchCustomerDetail(customerId).then(setCustomer);
  }, [customerId]);

  if (!customer) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <button onClick={onBack}>Back</button>
      <h2>{customer.name}</h2>
      <p>Segment: {customer.segment}</p>
      <p>Health Score: {customer.healthScore}</p>

      <h3>Events</h3>
      <div>
        {customer.openTickets + customer.closedTickets > 0 && (
          <Card>
            <p>Open Tickets: {customer.openTickets}</p>
            <p>Closed Tickets: {customer.closedTickets}</p>
            <p>High Priority Open Tickets: {customer.highPriorityOpenTickets}</p>
          </Card>
        )}

        <Card>
          <p>Login Count: {customer.loginCount}</p>
          <p>Feature Adoption: {customer.featureAdoption}%</p>
          <p>Late Invoices: {customer.lateInvoices}</p>
          <p>Total Invoices: {customer.totalInvoices}</p>
          <p>API Usage Change: {customer.apiUsageChange}%</p>
        </Card>
      </div>
    </div>
  );
};
