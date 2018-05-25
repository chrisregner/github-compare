import { call, put, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { SEARCH_REPOS } from './actionTypes'
import * as api from './api'

import { addRepos, setError, clearSearch } from './reducer'

function * searchRepos ({ payload }) {
  try {
    yield call(delay, 500)

    if (payload) {
      const res = yield call(api.search, payload)
      const leanRepos = res.data.items.map(filterRepoData)

      yield put(addRepos(leanRepos))
    } else {
      yield put(clearSearch())
    }
  } catch (e) {
    console.error(e)
    yield put(setError(e))
  }
}

function * rootSaga () {
  yield takeLatest(SEARCH_REPOS, searchRepos)
}

/* Internal Functions */
const filterRepoData = repo => ({
  name: repo.name,
  full_name: repo.full_name,
  html_url: repo.html_url,
  description: repo.description,
  created_at: repo.created_at,
  updated_at: repo.updated_at,
  stargazers_count: repo.stargazers_count,
  open_issues_count: repo.open_issues_count,
  watchers_count: repo.watchers_count,
  forks_count: repo.forks_count,
  owner_name: repo.owner.login,
  owner_url: 'https://github.com/' + repo.owner.login,
})

export default rootSaga
