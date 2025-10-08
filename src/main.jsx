import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import { ApolloProvider } from '@apollo/client'
import { Provider } from 'react-redux'
import { store } from './Store/store.js'
import client from './graphql/client.js'

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
