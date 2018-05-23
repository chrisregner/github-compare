import { handleActions, createAction } from 'redux-actions'
import { SEARCH_REPOS, ADD_REPOS, SET_ERROR, CLEAR_SEARCH } from './actionTypes'

/* Reducer */
const defaultState = {
  step: 0,
  repos: [],
  error: null,
}

const rootReducer = handleActions({
  [SEARCH_REPOS]: (state) => ({
    step: 1,
    repos: [],
    error: null,
  }),
  [ADD_REPOS]: (state, action) => ({
    step: 2,
    repos: [...state.repos, ...action.payload],
  }),
  [SET_ERROR]: (state, action) => ({
    step: 2.1,
    error: action.payload,
  }),
  [CLEAR_SEARCH]: (state, action) => ({
    step: 0,
    error: null,
    repos: [],
  })
}, defaultState)

/* Action Creators */
export const searchRepos = createAction(SEARCH_REPOS)
export const addRepos = createAction(ADD_REPOS)
export const setError = createAction(SET_ERROR)
export const clearSearch = createAction(CLEAR_SEARCH)

/* Selectors */
export const selectRepos = ({ repos }) => repos
export const selectError = ({ error }) => error
export const selectStep = ({ step }) => step

export default rootReducer