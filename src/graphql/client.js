import {ApolloClient, InMemoryCache, HttpLink, from} from '@apollo/client'
import { onError } from '@apollo/client/link/error'

const GRAPHQL_URI = import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_GRAPHQL_PROD_URI || 'https://sacco-graphql-server.onrender.com/graphql'
    : import.meta.env.VITE_GRAPHQL_DEV_URI || 'http://localhost:4000'

// Registered from main.jsx; a callback avoids a client -> store -> reducers -> client import cycle
let onUnauthorized = () => {}
export const setUnauthorizedHandler = (handler) => {
    onUnauthorized = handler
}

// The gateway returns UNAUTHORIZED when the token cookie is missing, invalid or expired
const authErrorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors?.some(err => err.extensions?.code === 'UNAUTHORIZED')) {
        onUnauthorized()
    }
})

const httpLink = new HttpLink({
    uri: GRAPHQL_URI,
    credentials: 'include' // Send cookies with requests
})

const client = new ApolloClient({
    link: from([authErrorLink, httpLink]),
    cache: new InMemoryCache()
})

export default client
