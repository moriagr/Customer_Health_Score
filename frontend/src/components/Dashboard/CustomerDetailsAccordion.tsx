import React, { useState } from "react";
import { Card } from "../UI/Card";
import { CurrCustomerDetail } from "../../types/customer";
// assuming printDate is already defined

export default function CustomerDetailsAccordion({ customer }: { customer: CurrCustomerDetail }) {
    const [openSections, setOpenSections] = useState({
        events: false,
        tickets: false,
        invoices: false,
    });

    const toggleSection = (section: "events" | "tickets" | "invoices") => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    function printDate(date: Date | null): string {
        return (date ? JSON.stringify(date) : "N/A");
    }

    return (
        <div>

            <h2>Detailed Health Scores:</h2>

            {/* Events */}
            <h3
                style={{ cursor: "pointer" }}
                onClick={() => toggleSection("events")}
            >
                Events {openSections.events ? "▼" : "▶"}
            </h3>
            {openSections.events && (
                customer?.events?.length > 0 ? (
                    customer.events.map((event, idx) => (
                        <Card key={idx} style={{ marginBottom: 10 }}>
                            <p><strong>Event:</strong> {event.event_type}</p>
                            <p><strong>Date:</strong> {printDate(event.created_at)}</p>
                            <p><strong>Description:</strong> {JSON.stringify(event.event_data)}</p>
                        </Card>
                    ))
                ) : (
                    <p>No events found.</p>
                )
            )}

            {/* Tickets */}
            <h3
                style={{ cursor: "pointer" }}
                onClick={() => toggleSection("tickets")}
            >
                Tickets {openSections.tickets ? "▼" : "▶"}
            </h3>
            {openSections.tickets && (
                customer?.tickets?.length > 0 ? (
                    customer.tickets.map((ticket) => (
                        <Card key={ticket.id} style={{ marginBottom: 10 }}>
                            <p><strong>Status:</strong> {ticket.status}</p>
                            <p><strong>Priority:</strong> {ticket.priority}</p>
                            <p><strong>Created:</strong> {printDate(ticket.created_at)}</p>
                            <p><strong>Resolved:</strong> {printDate(ticket.resolved_at)}</p>
                        </Card>
                    ))
                ) : (
                    <p>No tickets.</p>
                )
            )}

            {/* Invoices */}
            <h3
                style={{ cursor: "pointer" }}
                onClick={() => toggleSection("invoices")}
            >
                Invoices {openSections.invoices ? "▼" : "▶"}
            </h3>
            {openSections.invoices && (
                customer?.invoices?.length > 0 ? (
                    customer.invoices.map((invoice) => (
                        <Card key={invoice.id} style={{ marginBottom: 10 }}>
                            <p><strong>Amount:</strong> {invoice.amount}$</p>
                            <p><strong>Status:</strong> {invoice.status}</p>
                            <p><strong>Due Date:</strong> {printDate(invoice.due_date)}</p>
                            <p><strong>Paid Date:</strong> {printDate(invoice.paid_date) ?? 'Not paid'}</p>
                        </Card>
                    ))
                ) : (
                    <p>No invoices.</p>
                )
            )}
        </div>
    );
}
