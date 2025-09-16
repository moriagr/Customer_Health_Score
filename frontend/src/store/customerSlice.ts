import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrCustomerDetail, Customer, DashboardSummary } from "../types/customer";
import { loadCustomers, loadDashboard, loadCustomerDetails } from "../services/api";

export interface CustomersState {
    topAtRisk: number[];
    summary: { data: DashboardSummary, fetchedAt: number | null } | null;
    customers: { data: Record<number, Customer>, fetchedAt: number | null }; // dictionary
    customerDetails: Record<number, { data: CurrCustomerDetail; fetchedAt: number }>;
    loading: boolean;
    error: string | null;
}

const initialState: CustomersState = {
    topAtRisk: [],
    summary: {
        data: {
            "At Risk": 0,
            Healthy: 0,
            Middle: 0,
            total_customers: 0
        }, fetchedAt: null
    },
    customers: { data: {}, fetchedAt: null },
    customerDetails: {},
    loading: false,
    error: null,
};

const customersSlice = createSlice({
    name: "customers",
    initialState,
    reducers: {
        setTop5Ids: (state, action: PayloadAction<number[]>) => {
            state.topAtRisk = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadDashboard.fulfilled, (state, action) => {
                state.loading = false;
                const { topAtRisk, summary } = action.payload;
                state.topAtRisk = [];
                for (let customer of topAtRisk) {
                    state.topAtRisk.push(customer.id);
                    if (!state.customers.data[customer.id]) {
                        state.customers.data[customer.id] = customer;
                    }
                }
                state.summary = { data: summary, fetchedAt: Date.now() };
            })
            .addCase(loadDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(loadCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadCustomers.fulfilled, (state, action) => {
                state.loading = false;
                for (let customer of action.payload) {
                    state.customers.data[customer.id] = customer;
                }
                state.customers.fetchedAt = Date.now();
            })
            .addCase(loadCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(loadCustomerDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadCustomerDetails.fulfilled, (state, action) => {
                state.loading = false;
                const customer = action.payload;
                console.log('✌️customer --->', customer);
                console.log('✌️state.customerDetails --->', state.customerDetails);
                state.customerDetails[customer.id] = {
                    fetchedAt: Date.now(),
                    data: customer,
                };
                console.log('✌️state.customerDetails --->', state.customerDetails);
            })
            .addCase(loadCustomerDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});


export const { setTop5Ids } = customersSlice.actions;
export default customersSlice.reducer;
