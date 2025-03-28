import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userReducer";
import transactionReducer from "../reducers/transactionReducer";
import transactiontypeReducer from "../reducers/transactiontypesReducer";
import loansReducer from '../reducers/loansReducer'
import loanappsReducer from '../reducers/loanappsReducer'


export const store = configureStore({
    
    reducer: {
        users: userReducer,
        // TODO: add Transactions
        transactions: transactionReducer,
        // TODO: add transaction types
        transactiontypes: transactiontypeReducer,
        // TODO: loans
        loans: loansReducer,
        // TODO: loan applications
        loanapps: loanappsReducer
    }
})