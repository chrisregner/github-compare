import { compose, withState, withPropsOnChange } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { pick } from 'ramda'
import App from './App'

const SEARCH_REPO_QUERY = gql`
  query SearchRepoQuery($query: String!, $after: String) {
    search(query: $query, after: $after, type: REPOSITORY, first: 30) {,
      pageInfo {
        endCursor,
        hasNextPage,
      },
      nodes {
        ... on Repository {
          name,
          nameWithOwner,
          url,
          description,
          createdAt,
          updatedAt,
          owner { login, url },
          issues (states: [OPEN]) { totalCount },
          forks (affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) { totalCount },
          stargazers { totalCount },
          watchers { totalCount },
        }
      },
    }
  }
`

const AppContainer = compose(
  withState('inputValue', 'updateInputValue', ''),

  graphql(SEARCH_REPO_QUERY, {
    options: ({ inputValue }) => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        query: inputValue.trim(),
      },
    }),
    skip: props => props.inputValue.trim() === '',
    props: ({ data: { error, loading, search, fetchMore }, ownProps: { inputValue } }) => ({
      error, loading,
      onLoadMore: search && search.pageInfo.hasNextPage
        && (() => fetchMore({
          variables: {
            query: inputValue.trim(),
            after: search.pageInfo.endCursor,
          },
          updateQuery: (old, { fetchMoreResult: newer }) =>
            !newer ? old : {
              search: {
                ...newer.search,
                nodes: [...old.search.nodes, ...newer.search.nodes],
              }
            }
        })),
      searchResult: search && search.nodes.map(repo => ({
        ...pick(['name', 'nameWithOwner', 'description', 'createdAt', 'updatedAt'], repo),
        githubUrl: repo.url,
        forkCount: repo.forks.totalCount,
        stargazerCount: repo.stargazers.totalCount,
        openIssueCount: repo.issues.totalCount,
        watcherCount: repo.watchers.totalCount,
        ownerUsername: repo.owner.login,
        ownerGithubUrl: repo.owner.url,
      })),
    }),
  }),
)(App)

export default AppContainer
