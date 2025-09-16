import { createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "./axiosInstance";
import { CustomersState } from "../store/customerSlice";

const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours in ms

export const loadDashboard = createAsyncThunk<
    any, // replace with actual Dashboard type
    void,
    { state: { customers: CustomersState } }
>(
    "/customers/loadDashboard",
    async (_, { rejectWithValue }) => {
        try {
            const response = await Axios.get("/dashboard/");
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
    {
        condition: (_, { getState }) => {
            const state = getState().customers;
            if (state.summary && Date.now() - (state.summary.fetchedAt || 0) < CACHE_DURATION) {
                return false; // skip fetching if cached and valid
            }
            return true;
        },
    }
);

export const loadCustomers = createAsyncThunk<
    any, // replace with Customer[]
    void,
    { state: { customers: CustomersState } }
>(
    "/customers/loadAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await Axios.get("/customers/");
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
    {
        condition: (_, { getState }) => {
            const state = getState().customers;
            // skip if customers already loaded
            if (state.summary && Date.now() - (state.customers.fetchedAt || 0) < CACHE_DURATION) return false;
            return true;
        },
    }
);

export const loadCustomerDetails = createAsyncThunk<
    any, // replace with CurrCustomerDetail type
    number,
    { state: { customers: CustomersState } }
>(
    "/customers/loadCustomerDetails",
    async (id, { rejectWithValue }) => {
        try {
            const response = await Axios.get(`/customers/${id}/health`);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
    {
        condition: (id, { getState }) => {
            const state = getState().customers;
            console.log('✌️state --->', state);
            const cached = state.customerDetails[id];
console.log('✌️state.customerDetails --->', state.customerDetails);
            if (cached && Date.now() - cached.fetchedAt < CACHE_DURATION) {
                return false; // skip fetching if cached and valid
            }
            return true;
        },
    }
);
