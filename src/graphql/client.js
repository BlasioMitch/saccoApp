import {ApolloClient, InMemoryCache, HttpLink} from '@apollo/client'

const GRAPHQL_URI = import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_GRAPHQL_PROD_URI || 'https://sacco-graphql-server.onrender.com/graphql'
    : import.meta.env.VITE_GRAPHQL_DEV_URI || 'http://localhost:4000'

const client = new ApolloClient({
    link: new HttpLink({
        uri: GRAPHQL_URI,
        credentials: 'include' // Send cookies with requests
    }),
    cache: new InMemoryCache()
})

export default client