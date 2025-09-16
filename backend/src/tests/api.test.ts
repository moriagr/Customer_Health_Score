/// <reference types="jest" />
import request from "supertest";
import express, { Application } from "express";
import customerRoutes from "../routes/customers";
import dashboardRoute from "../routes/dashboard";
import * as customerModel from "../models/customerModel";
import { mockCustomers } from "./mockData";
import { getAllCustomersWithHealth } from "../controllers/customersController";


// Create Express app
const app: Application = express();
app.use(express.json());
app.use("/api/customers", customerRoutes);
app.use("/api/dashboard", dashboardRoute);

// Mock the database/model functions
jest.mock("../models/customerModel");

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Customer API routes", () => {
    // GET /api/dashboard -> getAllCustomersWithHealth
    test("GET /api/dashboard/ returns summary and topAtRisk", async () => {
        (customerModel.getAll as jest.Mock).mockResolvedValue(mockCustomers);

        const res = await request(app).get("/api/dashboard");
        expect(res.status).toBe(200);
        expect(res.body.summary.total_customers).toBe(3);
        expect(res.body.summary.Healthy).toBe(2);
        expect(res.body.summary.Middle).toBe(0);
        expect(res.body.summary["At Risk"]).toBe(1);
        expect(res.body.topAtRisk.length).toBe(3);
        expect(res.body.topAtRisk[0].name).toBe("Bob");
    });

    // GET /api/customers -> getAllCustomers
    test("GET /api/customers/ returns all customers with health", async () => {
        (customerModel.getAll as jest.Mock).mockResolvedValue([
            {
                customer_id: 1,
                customer_name: "Alice",
                segment: "Enterprise",
                events: [],
                tickets: [],
                invoices: [],
            },
            {
                customer_id: 2,
                customer_name: "Bob",
                segment: "SMB",
                events: [],
                tickets: [],
                invoices: [],
            },
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
        (customerModel.getById as jest.Mock).mockResolvedValue(mockCustomer);

        const res = await request(app).get("/api/customers/1/health");
        expect(res.status).toBe(200);
        expect(res.body.customerName).toBe("Alice");
        expect(res.body.tickets).toEqual([]);
        expect(res.body.invoices).toEqual([]);
        expect(res.body.scores).toBeDefined();
    });


    // POST /api/customers/:id/events -> recordEvent
    test("POST /api/customers/:id/events records an event", async () => {
        (customerModel.addRecord as jest.Mock).mockResolvedValue(undefined);

        const res = await request(app)
            .post("/api/customers/1/events")
            .send({ options: { eventType: "login" } });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Event recorded");
        expect(customerModel.addRecord).toHaveBeenCalledWith("1", { eventType: "login" });
    });
});

describe("Customer API error handling", () => {

    test("GET /api/customers - handles DB error", async () => {
        (customerModel.getAll as jest.Mock).mockRejectedValue(new Error("DB connection failed"));

        const res = await request(app).get("/api/customers");
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Error fetching customers: DB connection failed");
    });

    test("GET /api/customers/:id/health - handles customer not found", async () => {
        (customerModel.getById as jest.Mock).mockResolvedValue(null);

        const res = await request(app).get("/api/customers/999/health");
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Customer not found");
    });

    test("GET /api/customers - handles customer not found", async () => {
        (customerModel.getAll as jest.Mock).mockResolvedValue([]);

        const res = await request(app).get("/api/customers");
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("No customers found");
    });

    test("GET /api/customers/:id/health - handles DB error", async () => {
        (customerModel.getById as jest.Mock).mockRejectedValue(new Error("DB timeout"));

        const res = await request(app).get("/api/customers/1/health");
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("DB timeout");
    });

    test("POST /api/customers/:id/events - handles DB error on addRecord", async () => {
        (customerModel.addRecord as jest.Mock).mockRejectedValue(new Error("Insert failed"));

        const res = await request(app)
            .post("/api/customers/1/events")
            .send({ options: { eventType: "login" } });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Error saving customer events: Insert failed");
    });

    test("GET /api/dashboard - handles service error", async () => {
        jest.spyOn(customerModel, "getAll").mockImplementation(() => {
            throw new Error("Dashboard service error");
        });

        const res = await request(app).get("/api/dashboard");

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Error fetching customers: Dashboard service error");
    });

    test("GET /api/customers returns 500 on DB error", async () => {
        (customerModel.getAll as jest.Mock).mockRejectedValue(new Error("DB connection failed"));

        const res = await request(app).get("/api/customers");

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: "Error fetching customers: DB connection failed" });
    });

    test("GET /api/customers returns 500 on unknown error", async () => {
        (customerModel.getAll as jest.Mock).mockImplementation(() => { throw "weird error"; });

        const res = await request(app).get("/api/customers");

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: "Error fetching customers: weird error" });
    });


    test("GET /api/customers returns 500 if events are malformed", async () => {
        (customerModel.getAll as jest.Mock).mockResolvedValue([
            { customer_id: 1, customer_name: "BadCo", segment: "SMB", events: null, tickets: [], invoices: [] }
        ]);

        const res = await request(app).get("/api/customers");

        expect(res.status).toBe(500);
        expect(res.body.error).toMatch(/Error fetching customers:/);
    });

    test("GET /api/dashboard - returns 404 if no customers found", async () => {
        // Mock getCustomers to return an empty array
        (customerModel.getAll as jest.Mock).mockResolvedValue([]);

        const res = await request(app).get("/api/dashboard");

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ message: "No customers found" });

    });

});

// describe("getAllCustomersWithHealth error handling", () => {
//     test("returns 500 if getCustomers rejects with Error", async () => {
//         // Mock getCustomers to reject
//         jest.spyOn(require("../controllers/customersController"), "getCustomers")
//             .mockRejectedValue(new Error("DB failure"));

//         // Mock req and res
//         const req = {} as any;
//         const json = jest.fn();
//         const status = jest.fn(() => ({ json }));
//         const res = { status } as any;

//         await getAllCustomersWithHealth(req, res);

//         expect(status).toHaveBeenCalledWith(500);
//         expect(json).toHaveBeenCalledWith({ error: "DB failure" });
//     });

//     test("returns 500 if getCustomers rejects with non-Error", async () => {
//         jest.spyOn(require("../controllers/customersController"), "getCustomers")
//             .mockRejectedValue("weird failure");

//         const req = {} as any;
//         const json = jest.fn();
//         const status = jest.fn(() => ({ json }));
//         const res = { status } as any;

//         await getAllCustomersWithHealth(req, res);

//         expect(status).toHaveBeenCalledWith(500);
//         expect(json).toHaveBeenCalledWith({ error: "weird failure" });
//     });
// });

