import React, { useCallback, useEffect, useState } from 'react';
import { fetchCurrentCustomers } from '../../services/api';
import { CurrCustomerDetail, PieData } from '../../types/customer';
import { Card } from '../UI/Card';
import { DataStateHandler } from '../Layout/DataStateHandler';
import CustomerComparisonChart from './ComparisonBarChart';
import { GenericPieChart } from './HealthPieChart';
import { PresentScore } from '../UI/PresentScore';

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
    let dataTicket: PieData[] = [], totalTickets = 0;
    let dataInvoices: PieData[] = [], totalInvoices = 0;

    if (customer) {
        if (customer.tickets.length > 0) {

            const { total_tickets, ...categoryCounts } = {
                "Open tickets with low priority": customer.ticketsData?.openTickets || 0,
                "Open tickets with medium priority": customer.ticketsData?.mediumTickets || 0,
                "Open tickets with high priority": customer.ticketsData?.highTickets || 0,
                "Pending tickets": customer.ticketsData?.pendingTickets || 0,
                "Closed tickets": customer.ticketsData?.closedTickets || 0,
                total_tickets: (customer.ticketsData?.openTickets || 0) + (customer.ticketsData?.pendingTickets || 0) + (customer.ticketsData?.mediumTickets || 0) + (customer.ticketsData?.highTickets || 0) + (customer.ticketsData?.closedTickets || 0),
            };
            totalTickets = total_tickets || 0;


            dataTicket = (Object.keys(categoryCounts) as (keyof typeof categoryCounts)[]).map((cat) => ({
                name: cat,
                value: categoryCounts[cat],
                percentage: totalTickets ? ((categoryCounts[cat] / totalTickets) * 100).toFixed(1) : "0",
            }));
        }

        if (customer.invoices.length > 0) {

            const { ...categoryCounts } = {
                "Invoice payment on time": customer.invoicePayment?.onTime || 0,
                "Invoice payment unpaid": customer.invoicePayment?.unpaid || 0,
                "Invoice payment late": customer.invoicePayment?.late || 0,
            };
            totalInvoices = customer.invoicePayment?.total || 0;

            dataInvoices = (Object.keys(categoryCounts) as (keyof typeof categoryCounts)[]).map((cat) => ({
                name: cat,
                value: categoryCounts[cat],
                percentage: totalInvoices ? ((categoryCounts[cat] / totalInvoices) * 100).toFixed(1) : "0",
            }));
        }
    }

    const colorsTickets = {
        "Open tickets with low priority": "#f5c542",   // yellow
        "Open tickets with medium priority": "#ff8c42", // orange
        "Open tickets with high priority": "#ff4d4d",   // red
        "Pending tickets": "#6495ed",                  // blue
        "Closed tickets": "#82ca9d",                   // green
    };

    const colorsInvoices = {
        "Invoice payment late": "#ff4d4d",   // red
        "Invoice payment unpaid": "#ff8c42", // orange
        "Invoice payment on time": "#82ca9d", // green
    };

    // function presentScore(score:number | null){
    // 


    // }
    return (
        <DataStateHandler loading={loading} error={error} goBack={onBack} tryAgain={getData} isEmpty={!customer} emptyMessage="No customer data available.">
            <h2>{JSON.stringify(customer?.customerName)}</h2>
            <p>Segment: {JSON.stringify(customer?.customerSegment)}</p>
            {<PresentScore score={customer?.score} />}
            {customer && customer.lastMonth && customer.currentMonth && (
                <CustomerComparisonChart
                    lastMonth={customer.lastMonth}
                    thisMonth={customer.currentMonth}
                />
            )}
            <div style={{
                display: "flex",
                flexWrap: "wrap", // allows stacking on small screens
                gap: 16,
            }}
            >
                {customer && customer.tickets.length > 0 && <GenericPieChart colors={colorsTickets} total={totalTickets} data={dataTicket} text="Support ticket volume" />}
                {customer && customer.invoices.length > 0 && <GenericPieChart colors={colorsInvoices} total={totalInvoices} data={dataInvoices} text="Invoice payment timeliness" />}
            </div>
            <h2>Detailed Health Scores:</h2>

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
