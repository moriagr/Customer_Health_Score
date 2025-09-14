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
            eventType: "login",
            event_data: { ip: "127.0.0.1" },
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
            .mockImplementationOnce(() => Promise.reject(new Error("Insert failed")))
            .mockImplementationOnce(() => Promise.resolve()); // BEGIN succeeds, INSERT fails, COMMIT skipped

        await expect(
            addRecord(1, { eventType: "login" })
        ).rejects.toThrow("Insert failed");

        expect(pool.query).toHaveBeenCalledWith("ROLLBACK");
    });
});
