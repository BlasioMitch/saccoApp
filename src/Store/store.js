import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userReducer";
export const store = configureStore({
    reducer: {
        users: userReducer,
        // TODO: add transaction types
        // TODO: add Transactions
    }
})