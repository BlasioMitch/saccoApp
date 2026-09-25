import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import { ApolloProvider } from '@apollo/client'
import { Provider } from 'react-redux'
import { store } from './Store/store.js'
import client, { setUnauthorizedHandler } from './graphql/client.js'
import { sessionExpired } from './reducers/authReducer'
import { toast } from 'sonner'

// Expired/invalid token: drop local auth state; ProtectedRoute then redirects to /login
setUnauthorizedHandler(() => {
  // Several queries can fail at once; only react to the first
  if (!store.getState().auth.isAuthenticated) return
  store.dispatch(sessionExpired())
  client.clearStore().catch(() => {})
  toast.error('Your session has expired. Please log in again.')
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <Router >
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    </Router>
  </ApolloProvider>
)
