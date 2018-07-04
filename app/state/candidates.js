import { handleActions, createAction } from 'redux-actions'
import { getCandidates } from 'app/state'

/* Action Types */
const TOGGLE_CANDIDATE = 'gihub-search/candidates/TOGGLE_CANDIDATE'

/* Redux */
const defaultState = []
export default handleActions({

  [TOGGLE_CANDIDATE]: (state, { payload }) =>
    state.find(candidate => candidate.nameWithOwner === payload.nameWithOwner)
      ? state.filter(candidate => candidate.nameWithOwner !== payload.nameWithOwner)
      : [...state, payload],

}, defaultState)

/* Action Creators */
export const toggleCandidate = createAction(TOGGLE_CANDIDATE)

/* Selectors */
export { getCandidates }
export const getIds = state => getCandidates(state).map(candidate => candidate.nameWithOwner)
export const getCount = state => getCandidates(state).length
