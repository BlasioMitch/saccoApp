import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userReducer";
import transactionReducer from "../reducers/transactionReducer";
import transactiontypeReducer from "../reducers/transactiontypesReducer";
import loansReducer from '../reducers/loansReducer'
import loanappsReducer from '../reducers/loanappsReducer'
import accountsReducer from '../reducers/accountsReducer'
import authReducer from '../reducers/authReducer'
import profileReducer from '../reducers/profileReducer'


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
        loanapps: loanappsReducer,
        // TODO: add accounts
        accounts: accountsReducer,
        // TODO: add auth
        auth: authReducer,
        // TODO: add profile
        profile: profileReducer
    }
})