import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { REHYDRATE } from '../offline/persist'
import userReducer from "../reducers/userReducer";
import transactionReducer from "../reducers/transactionReducer";
import loansReducer from '../reducers/loansReducer'
import accountsReducer from '../reducers/accountsReducer'
import authReducer from '../reducers/authReducer'
import profileReducer from '../reducers/profileReducer'
import savingsReducer from '../reducers/savingsReducer'
import loanPaymentsReducer from '../reducers/loanPaymentsReducer'


const appReducer = combineReducers({
    users: userReducer,
    transactions: transactionReducer,
    loans: loansReducer,
    accounts: accountsReducer,
    auth: authReducer,
    profile: profileReducer,
    savings: savingsReducer,
    loanPayments: loanPaymentsReducer,
})

// offline/rehydrate: the lists saved in this browser for the signed-in user (shown at once, and offline)
const rootReducer = (state, action) => action.type === REHYDRATE
    ? appReducer({ ...state, ...action.payload }, action)
    : appReducer(state, action)

export const store = configureStore({ reducer: rootReducer })
