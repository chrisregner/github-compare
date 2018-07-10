import { handleActions, createAction } from 'redux-actions'
import * as fromState from 'app/state'
import { colors } from 'app/constants'

/* Action Types */
const TOGGLE_CANDIDATE = 'gihub-search/candidates/TOGGLE_CANDIDATE'

/* Redux */
const defaultState = {
  availableColors: colors,
  candidates: [],
}
export default handleActions({

  [TOGGLE_CANDIDATE]: ({ candidates, availableColors, ...state }, { payload }) => {
    const match = candidates.find(cand => cand.nameWithOwner === payload.nameWithOwner)

    return {
      candidates: match
        ? candidates.filter(cand => cand !== match)
        : [...candidates, { ...payload, color: availableColors[0] }],
      availableColors: match
        ? [...availableColors, match.color]
        : availableColors.slice(1),
      ...state,
    }
  },

}, defaultState)

/* Action Creators */
export const toggleCandidate = createAction(TOGGLE_CANDIDATE)

/* Selectors */
export const getCandidates = state => fromState.getCandidates(state).candidates
export const getIds = state => getCandidates(state).map(candidate => candidate.nameWithOwner)
export const getCount = state => getCandidates(state).length
