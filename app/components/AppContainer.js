import { compose, withState } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import App from './App'

const SEARCH_REPO_QUERY = gql`
  query SearchRepoQuery($query: String!) {
    search(query: $query, type: REPOSITORY, first: 30) {
      nodes {
        ... on Repository {
          name,
          nameWithOwner,
          url,
          description,
          createdAt,
          updatedAt,
          owner {
            login,
            url
          },
          issues (states: [OPEN]) {
            totalCount,
          },
          forks (affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {
            totalCount,
          },
          stargazers {
            totalCount,
          },
          watchers {
            totalCount,
          },
        }
      },
    }
  }
`

const AppContainer = compose(
  withState('inputValue', 'updateInputValue', ''),
  graphql(SEARCH_REPO_QUERY, {
    options: ({ inputValue }) => ({
      variables: {
        query: inputValue.trim(),
      },
    }),
    skip: props => props.inputValue.trim() === '',
    props: ({ data: { error, loading, search } }) => ({
      error,
      loading,
      searchResult: search && search.nodes.map(repo => ({
        name: repo.name,
        nameWithOwner: repo.nameWithOwner,
        githubUrl: repo.url,
        description: repo.description,
        createdAt: repo.createdAt,
        updatedAt: repo.updatedAt,
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
