import { compose, withState } from 'recompose'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { pick } from 'ramda'
import gql from 'graphql-tag'
import Search from './SearchContainer/Search'
import { toggleCandidate, getIds } from 'app/state/candidates'

const SEARCH_REPO_QUERY = gql`
  query SearchRepoQuery($query: String!, $after: String) {
    search(query: $query, after: $after, type: REPOSITORY, first: 10) {,
      repositoryCount,
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

export default compose(
  withState('inputValue', 'updateInputValue', ''),

  connect(
    state => ({ candidateIds: getIds(state) }),
    { toggleCandidate }
  ),

  graphql(SEARCH_REPO_QUERY, {
    options: ({ inputValue }) => ({
      notifyOnNetworkStatusChange: true,
      variables: {
        query: inputValue.trim(),
      },
    }),

    skip: props => props.inputValue.trim() === '',

    props: ({
      data: { error, networkStatus, search, fetchMore, variables },
      ownProps: { inputValue }
    }) => ({
      error,
      repositoryCount: search && search.repositoryCount,

      status: (() => {
        switch (networkStatus) {
          case 1:
          case 2:
          case 3:
            return 'loading'
          case 8:
            return 'error'
          case 7:
            switch (true) {
              case (variables.query.length && !(search.nodes && search.nodes.length)):
                return 'no-match'
              case (search && search.pageInfo.hasNextPage):
                return 'can-load-more'
              case (search && !search.pageInfo.hasNextPage):
                return 'no-more'
              default:
                return 'ready'
            }
          default:
            throw new Error('Unanticipated networkStatus encountered')
        }
      })(),

      onLoadMore: (search && search.pageInfo.hasNextPage)
        ? (() => fetchMore({
          variables: {
            query: inputValue.trim(),
            after: search.pageInfo.endCursor,
          },
          updateQuery: (oldRes, { fetchMoreResult: newRes }) =>
            !newRes ? oldRes : {
              search: {
                ...newRes.search,
                nodes: [...oldRes.search.nodes, ...newRes.search.nodes],
              }
            }
        }))
        : null,

      searchResult: (![1, 2].includes(networkStatus) && search)
        ? search.nodes.map(repo => ({
          ...pick(['name', 'nameWithOwner', 'description', 'createdAt', 'updatedAt'], repo),
          githubUrl: repo.url,
          forkCount: repo.forks.totalCount,
          stargazerCount: repo.stargazers.totalCount,
          openIssueCount: repo.issues.totalCount,
          watcherCount: repo.watchers.totalCount,
          ownerUsername: repo.owner.login,
          ownerGithubUrl: repo.owner.url,
        }))
        : null,
    }),
  }),
)(Search)
