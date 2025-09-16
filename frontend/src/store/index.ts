import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./customerSlice";

export const store = configureStore({
  reducer: {
    customers: customersReducer,
  },
});

// Types (TS only)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
