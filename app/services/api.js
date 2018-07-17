import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

const TOKEN = 'ac7711077f78df8eae4c311921c9f5108ac35646'

const GITHUB_ENDPOINT = 'https://api.github.com/graphql'

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${TOKEN}`,
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri: GITHUB_ENDPOINT })),
  cache: new InMemoryCache(),
})

export default client
