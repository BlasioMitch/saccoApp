import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { HashRouter as Router } from 'react-router-dom'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './Store/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router basename='/saccoApp'>

  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
  </Router>
)
