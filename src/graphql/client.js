import {ApolloClient, InMemoryCache, HttpLink} from '@apollo/client'

const client =  new ApolloClient({
    link: new HttpLink({
        uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000',
        credentials: 'include' // Send cookies with requests
    }),
    cache: new InMemoryCache()
})

export default client