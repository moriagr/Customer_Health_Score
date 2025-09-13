import React, { useCallback, useEffect, useState } from 'react';
import { fetchCurrentCustomers } from '../../services/api';
import { CurrCustomerDetail } from '../../types/customer';
import { Card } from '../UI/Card';
import { EmptyDataMessage } from '../UI/EmptyDataMessage';
import { DataStateHandler } from '../Layout/DataStateHandler';

interface Props {
    customerId: number;
    onBack: () => void;
}

export const CustomerDetail: React.FC<Props> = ({ customerId, onBack }) => {
    const [customer, setCustomer] = useState<CurrCustomerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const getData = useCallback(() => {
        setLoading(true);
        setError(null);
        fetchCurrentCustomers(customerId)
            .then((data) => {
                setCustomer(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err.message);
                setError(err.message || 'Failed to load customer details.');
                setLoading(false);
            });
    }, [customerId])

    useEffect(() => {
        getData();
    }, [getData]);


    function printDate(date: Date | null): string {
        return (date ? JSON.stringify(date) : "N/A");
    }

    // if (!customer) return <EmptyDataMessage />;
    return (
        <DataStateHandler loading={loading} error={error} goBack={onBack} tryAgain={getData} isEmpty={!customer} emptyMessage="No customer data available.">
            <h2>{JSON.stringify(customer?.customerName)}</h2>
            <p>Segment: {JSON.stringify(customer?.customerSegment)}</p>
            <p>Health Score: {JSON.stringify(customer?.score) ?? 'N/A'}{customer?.score ? '%' : ''}</p>

            {/* Events */}
            <h3>Events</h3>
            {customer?.events && customer?.events.length > 0 ? (
                customer?.events.map((event, idx) => {
                    return <Card key={idx} style={{ marginBottom: 10 }}>
                        <p><strong>Event:</strong> {event.event_type}</p>
                        <p><strong>Date:</strong> {printDate(event.created_at)}</p>
                        <p><strong>Description:</strong> {JSON.stringify(event.event_data)}</p>
                    </Card>
                })
            ) : (
                <p>No events found.</p>
            )}

            {/* Tickets */}
            <h3>Tickets</h3>
            {customer?.tickets && customer?.tickets.length > 0 ? (
                customer?.tickets.map((ticket) => (
                    <Card key={ticket.id} style={{ marginBottom: 10 }}>
                        <p><strong>Status:</strong> {ticket.status}</p>
                        <p><strong>Priority:</strong> {ticket.priority}</p>
                        <p><strong>Created:</strong> {printDate(ticket.created_at)}</p>
                        <p><strong>Resolved:</strong> {printDate(ticket.resolved_at)}</p>
                    </Card>
                ))
            ) : (
                <p>No tickets.</p>
            )}

            {/* Invoices */}
            <h3>Invoices</h3>
            {customer?.invoices && customer?.invoices.length > 0 ? (
                customer?.invoices.map((invoice) => (
                    <Card key={invoice.id} style={{ marginBottom: 10 }}>
                        <p><strong>Amount:</strong> ${invoice.amount}</p>
                        <p><strong>Status:</strong> {invoice.status}</p>
                        <p><strong>Due Date:</strong> {printDate(invoice.due_date)}</p>
                        <p><strong>Paid Date:</strong> {printDate(invoice.paid_date) ?? 'Not paid'}</p>
                    </Card>
                ))
            ) : (
                <p>No invoices.</p>
            )}
        </DataStateHandler>
    )
};
