import { ApolloClient, ApolloLink, InMemoryCache, HttpLink, Observable, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { CachePersistor, LocalForageWrapper } from 'apollo3-cache-persist'
import { offlineStore } from '../offline/storage'
import { isOffline, markServerReachable, markServerUnreachable } from '../offline/network'
import { OFFLINE_OPERATION_NAMES } from '../offline/operations'

export const GRAPHQL_URI = import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_GRAPHQL_PROD_URI || 'https://sacco-graphql-server.onrender.com/graphql'
    : import.meta.env.VITE_GRAPHQL_DEV_URI || 'http://localhost:4000'

// Registered from main.jsx; a callback avoids a client -> store -> reducers -> client import cycle
let onUnauthorized = () => {}
export const setUnauthorizedHandler = (handler) => {
    onUnauthorized = handler
}

// The gateway returns UNAUTHORIZED when the token cookie is missing, invalid or expired, and
// PASSWORD_CHANGE_REQUIRED for a temporary-password session (only the sign-in page can finish that).
// No answer at all means the server can't be reached: the app keeps working offline.
const SIGN_OUT_CODES = ['UNAUTHORIZED', 'PASSWORD_CHANGE_REQUIRED']
const authErrorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors?.some(err => SIGN_OUT_CODES.includes(err.extensions?.code))) {
        onUnauthorized()
    }
    if (networkError && !networkError.statusCode) markServerUnreachable()
})

// Changes that can't be saved for later (deletes, imports, password resets…) say so straight away when offline,
// instead of waiting for the request to fail. Queueable ones never get here offline (see offline/mutateOrQueue).
const offlineGuardLink = new ApolloLink((operation, forward) => {
    const isMutation = operation.query.definitions.some(definition => definition.kind === 'OperationDefinition' && definition.operation === 'mutation')
    if (isMutation && isOffline() && !OFFLINE_OPERATION_NAMES.has(operation.operationName)) {
        return new Observable(observer => observer.error(new Error('You are offline. This needs a connection; try again when you are back online.')))
    }
    return forward(operation)
})

// Any answer from the server means it is reachable again
const reachableLink = new ApolloLink((operation, forward) => forward(operation).map(result => {
    markServerReachable()
    return result
}))

const httpLink = new HttpLink({
    uri: GRAPHQL_URI,
    credentials: 'include', // Send cookies with requests
    headers: { 'x-client': 'web' } // Audit trail: actions are recorded as coming from the web app
})

const cache = new InMemoryCache()

// The last data each page showed stays in this browser (IndexedDB), so pages open offline with it
export const apolloPersistor = new CachePersistor({
    cache,
    storage: new LocalForageWrapper(offlineStore),
    key: 'apollo-cache',
    maxSize: false,
    debounce: 1000,
})

const client = new ApolloClient({
    link: from([offlineGuardLink, authErrorLink, reachableLink, httpLink]),
    cache
})

export default client
