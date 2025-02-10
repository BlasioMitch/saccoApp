import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userReducer";
import transactionReducer from "../reducers/transactionReducer";
import transactiontypeReducer from "../reducers/transactiontypesReducer";

export const store = configureStore({
    
    reducer: {
        users: userReducer,
        // TODO: add Transactions
        transactions: transactionReducer,
        // TODO: add transaction types
        transactiontypes: transactiontypeReducer,
    }
})