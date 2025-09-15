/// <reference types="jest" />
import { getAll, getById, addRecord } from "../models/customerModel";
import pool from "../config/db";

jest.mock("../config/db", () => ({
    query: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe("getAll", () => {
    it("returns rows from the database", async () => {
        const mockRows = [
            { customer_id: 1, customer_name: "Alice", total_features: 5, segment: "Enterprise", events: [], tickets: [], invoices: [] },
            { customer_id: 2, customer_name: "Bob", total_features: 3, segment: "SMB", events: [], tickets: [], invoices: [] }
        ];

        (pool.query as jest.Mock).mockResolvedValue({ rows: mockRows });

        const result = await getAll();
        expect(pool.query).toHaveBeenCalled();
        expect(result).toEqual(mockRows);
    });

    it("throws an error if pool.query fails", async () => {
        (pool.query as jest.Mock).mockRejectedValue(new Error("DB error"));

        await expect(getAll()).rejects.toThrow("DB error");
    });
});


describe("getById", () => {
    it("returns a single customer", async () => {
        const mockCustomer = { customer_id: 1, customer_name: "Alice", total_features: 5, segment: "Enterprise", events: [], tickets: [], invoices: [] };
        (pool.query as jest.Mock).mockResolvedValue({ rows: [mockCustomer] });

        const result = await getById(1);
        expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1]);
        expect(result).toEqual(mockCustomer);
    });

    it("throws an error if pool.query fails", async () => {
        (pool.query as jest.Mock).mockRejectedValue(new Error("DB error"));

        await expect(getById(1)).rejects.toThrow("DB error");
    });
});


describe("addRecord", () => {
    beforeEach(() => {
        (pool.query as jest.Mock).mockReset();
    });

    it("inserts event, ticket, and invoice and commits", async () => {
        (pool.query as jest.Mock).mockResolvedValue({}); // all queries succeed

        await addRecord(1, {
            event: {
                eventType: "login",
                event_data: { ip: "127.0.0.1" },
            },
            ticket: { status: "open", priority: "high" },
            invoice: { amount: 100, dueDate: "2025-09-20", status: "unpaid" }
        });

        expect(pool.query).toHaveBeenCalledWith("BEGIN");
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO customer_events"),
            [1, "login", expect.any(String)]
        );
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO support_tickets"),
            [1, "open", "high"]
        );
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO invoices"),
            [1, 100, "2025-09-20", "unpaid"]
        );
        expect(pool.query).toHaveBeenCalledWith("COMMIT");
    });

    it("rolls back on error", async () => {
        (pool.query as jest.Mock).mockImplementationOnce(() => Promise.resolve())
            .mockImplementationOnce(() => Promise.reject(new Error("Error saving customer events: Insert failed")))
            .mockImplementationOnce(() => Promise.resolve()); // BEGIN succeeds, INSERT fails, COMMIT skipped

        await expect(
            addRecord(1, { event: { eventType: "login" } })
        ).rejects.toThrow("Error saving customer events: Insert failed");

        expect(pool.query).toHaveBeenCalledWith("ROLLBACK");
    });

    it("inserts a support ticket", async () => {
        (pool.query as jest.Mock).mockResolvedValue({}); // mock all queries succeed

        await addRecord(1, {
            ticket: { status: "open", priority: "high" },
        });

        // BEGIN
        expect(pool.query).toHaveBeenCalledWith("BEGIN");
        // Ticket insert
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO support_tickets"),
            [1, "open", "high"]
        );
        // COMMIT
        expect(pool.query).toHaveBeenCalledWith("COMMIT");
    });

    it("inserts an invoice", async () => {
        (pool.query as jest.Mock).mockResolvedValue({}); // mock all queries succeed

        await addRecord(2, {
            invoice: { amount: 200, dueDate: "2025-10-01", status: "unpaid" },
        });

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO invoices"),
            [2, 200, "2025-10-01", "unpaid"]
        );
        expect(pool.query).toHaveBeenCalledWith("COMMIT");
    });


    it("inserts event, ticket, and invoice together", async () => {
        (pool.query as jest.Mock).mockResolvedValue({}); // succeed

        await addRecord(3, {
            event: {
                eventType: "login",
                event_data: { ip: "127.0.0.1" }
            },
            ticket: { status: "pending", priority: "low" },
            invoice: { amount: 50, dueDate: "2025-12-01", status: "paid" },
        });

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO customer_events"),
            [3, "login", expect.any(String)]
        );
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO support_tickets"),
            [3, "pending", "low"]
        );
        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO invoices"),
            [3, 50, "2025-12-01", "paid"]
        );
    });


});


describe("addRecord - empty payload", () => {
  it("should throw an error if no event, ticket, or invoice is provided", async () => {
    await expect(
      addRecord(1, {}) // empty options object
    ).rejects.toThrow("No data provided. Include at least one of: event, ticket, or invoice.");

    // Ensure no DB queries are called
    expect(pool.query).not.toHaveBeenCalled();
  });
});