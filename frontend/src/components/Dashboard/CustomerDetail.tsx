import React, { useEffect } from 'react';
import { loadCustomerDetails } from '../../services/api';
import { PieData } from '../../types/customer';
import { DataStateHandler } from '../Layout/DataStateHandler';
import CustomerComparisonChart from './ComparisonBarChart';
import { GenericPieChart } from './HealthPieChart';
import { PresentScore } from '../UI/PresentScore';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import CustomerDetailsAccordion from './CustomerDetailsAccordion';

interface Props {
    customerId: number;
    onBack: () => void;
}

export const CustomerDetail: React.FC<Props> = ({ customerId, onBack }) => {

    const dispatch = useDispatch<AppDispatch>();

    const { loading, customerDetails, error } = useSelector(
        (state: RootState) => state.customers
    );

    useEffect(() => {
        dispatch(loadCustomerDetails(customerId));
    }, [dispatch, customerId]);


    let dataTicket: PieData[] = [], totalTickets = 0;
    let dataInvoices: PieData[] = [], totalInvoices = 0;

    if (Object.keys(customerDetails).length > 0 && customerDetails[customerId]) {
        if (customerDetails[customerId]?.data?.tickets.length > 0) {
            const ticketData = customerDetails[customerId].data.ticketsData;
            if (ticketData) {

                const { total_tickets, ...categoryCounts } = {
                    "Open tickets with low priority": ticketData.openTickets || 0,
                    "Open tickets with medium priority": ticketData.mediumTickets || 0,
                    "Open tickets with high priority": ticketData.highTickets || 0,
                    "Pending tickets": ticketData.pendingTickets || 0,
                    "Closed tickets": ticketData.closedTickets || 0,
                    total_tickets: (ticketData.openTickets || 0) + (ticketData.pendingTickets || 0) + (ticketData.mediumTickets || 0) + (ticketData.highTickets || 0) + (ticketData.closedTickets || 0),
                };
                totalTickets = total_tickets || 0;


                dataTicket = (Object.keys(categoryCounts) as (keyof typeof categoryCounts)[]).map((cat) => ({
                    name: cat,
                    value: categoryCounts[cat],
                    percentage: totalTickets ? ((categoryCounts[cat] / totalTickets) * 100).toFixed(1) : "0",
                }));
            }
        }

        if (customerDetails[customerId]?.data?.invoices.length > 0) {
            const invoicePaymentData = customerDetails[customerId].data.invoicePayment;
            if (invoicePaymentData) {

                const { ...categoryCounts } = {
                    "Invoice payment on time": invoicePaymentData.onTime || 0,
                    "Invoice payment unpaid": invoicePaymentData.unpaid || 0,
                    "Invoice payment late": invoicePaymentData.late || 0,
                };
                totalInvoices = invoicePaymentData.total || 0;

                dataInvoices = (Object.keys(categoryCounts) as (keyof typeof categoryCounts)[]).map((cat) => ({
                    name: cat,
                    value: categoryCounts[cat],
                    percentage: totalInvoices ? ((categoryCounts[cat] / totalInvoices) * 100).toFixed(1) : "0",
                }));
            }
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

    return (
        <DataStateHandler
            loading={loading}
            error={error}
            goBack={onBack}
            tryAgain={() => dispatch(loadCustomerDetails(customerId))}
            isEmpty={!customerDetails || !(Object.keys(customerDetails).length > 0) || !customerDetails[customerId] || !customerDetails[customerId].data}
            emptyMessage="No Customer data available.">

            <h2>{JSON.stringify(customerDetails[customerId]?.data.customerName)}</h2>
            <p>Segment: {JSON.stringify(customerDetails[customerId]?.data?.customerSegment)}</p>
            {<PresentScore score={customerDetails[customerId]?.data?.score} />}
            {customerDetails[customerId]?.data?.lastMonth &&
                customerDetails[customerId]?.data?.currentMonth && (
                    <CustomerComparisonChart
                        lastMonth={customerDetails[customerId].data.lastMonth}
                        thisMonth={customerDetails[customerId].data.currentMonth}
                    />
                )}
            <div style={{
                display: "flex",
                flexWrap: "wrap", // allows stacking on small screens
                gap: 16,
            }}
            >
                {customerDetails[customerId]?.data?.tickets.length > 0 && <GenericPieChart colors={colorsTickets} total={totalTickets} data={dataTicket} text="Support ticket volume" />}
                {customerDetails[customerId]?.data?.invoices.length > 0 && <GenericPieChart colors={colorsInvoices} total={totalInvoices} data={dataInvoices} text="Invoice payment timeliness" />}
            </div>
            <CustomerDetailsAccordion customer={customerDetails[customerId]?.data}/>
        </DataStateHandler>
    )
};
