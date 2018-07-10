import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

const TOKEN = '418405fe479a302151118a2c072be43a19c7e89b'
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
