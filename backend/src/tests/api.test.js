const request = require('supertest');
const express = require('express');
const customerRoutes = require('../routes/customers');
const customerModel = require('../models/customerModel');
const {
    calculateDetailed,
} = require('../services/healthScoreService');

// import request from "supertest";
// import express from "express";
// import customerRoutes from "../routes/customerRoutes";
// import customerModel from "../models/customerModel";
// import { calculateDetailed } from "../services/healthScoreService";

const app = express();
app.use(express.json());
app.use("/api/customers", customerRoutes);

// Mock the database/model functions
jest.mock("../models/customerModel");

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Customer API routes", () => {
    // GET /api/dashboard -> getAllCustomersWithHealth
    test("GET /api/dashboard returns summary and topAtRisk", async () => {
        const mockCustomers = [
            { id: 1, name: "Alice", score: 90, category: "Healthy", segment: "Enterprise" },
            { id: 2, name: "Bob", score: 50, category: "Middle", segment: "SMB" },
            { id: 3, name: "Charlie", score: 30, category: "At Risk", segment: "SMB" },
        ];

        // Mock getCustomers inside the route
        jest.spyOn(require("../routes/customerRoutes"), 'getCustomers').mockResolvedValue(mockCustomers);

        const res = await request(app).get("/api/dashboard");
        expect(res.status).toBe(200);
        expect(res.body.summary.total_customers).toBe(3);
        expect(res.body.summary.Healthy).toBe(1);
        expect(res.body.summary.Middle).toBe(1);
        expect(res.body.summary["At Risk"]).toBe(1);
        expect(res.body.topAtRisk.length).toBe(1);
        expect(res.body.topAtRisk[0].name).toBe("Charlie");
    });

    // GET /api/customers -> getAllCustomers
    test("GET /api/customers returns all customers with health", async () => {
        customerModel.getAll.mockResolvedValue([
            { customer_id: 1, customer_name: "Alice", total_features: 5, segment: "Enterprise", event_id: null, ticket_id: null, invoice_id: null },
            { customer_id: 2, customer_name: "Bob", total_features: 3, segment: "SMB", event_id: null, ticket_id: null, invoice_id: null },
        ]);

        const res = await request(app).get("/api/customers");
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body[0]).toHaveProperty("id");
        expect(res.body[0]).toHaveProperty("name");
    });

    // GET /api/customers/:id/health -> getCustomerHealth
    test("GET /api/customers/:id/health returns detailed health", async () => {
        const mockCustomer = {
            customer_name: "Alice",
            segment: "Enterprise",
            events: [],
            tickets: [],
            invoices: [],
        };
        customerModel.getById.mockResolvedValue(mockCustomer);

        const res = await request(app).get("/api/customers/1/health");
        expect(res.status).toBe(200);
        expect(res.body.customerName).toBe("Alice");
        expect(res.body.tickets).toEqual([]);
        expect(res.body.invoices).toEqual([]);
    });

    // GET /api/customers/:id/health -> 404 if not found
    test("GET /api/customers/:id/health returns 404 if customer not found", async () => {
        customerModel.getById.mockResolvedValue(null);
        const res = await request(app).get("/api/customers/999/health");
        expect(res.status).toBe(404);
    });

    // POST /api/customers/:id/events -> recordEvent
    test("POST /api/customers/:id/events records event successfully", async () => {
        customerModel.addRecord.mockResolvedValue(undefined);
        const res = await request(app)
            .post("/api/customers/1/events")
            .send({ options: { eventType: "login" } });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Event recorded");
    });

    // POST /api/customers/:id/events -> handles db error
    test("POST /api/customers/:id/events returns 500 if DB fails", async () => {
        customerModel.addRecord.mockRejectedValue(new Error("DB error"));
        const res = await request(app)
            .post("/api/customers/1/events")
            .send({ options: { eventType: "login" } });
        expect(res.status).toBe(500);
    });
});
