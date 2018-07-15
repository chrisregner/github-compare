import { handleActions, createAction } from 'redux-actions'
import * as fromState from 'app/state'
import colors from 'app/services/colors'
import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'

const MAXIMUM_CANDIDATES_COUNT = 10

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
const toggleCandidatePure = createAction(TOGGLE_CANDIDATE)

/* Thunks */
export const toggleCandidate = payload => (dispatch, getState) => {
  const candidates = getCandidates(getState())

  if (
    candidates.length === MAXIMUM_CANDIDATES_COUNT
    && !candidates.find(cand => cand.nameWithOwner === payload.nameWithOwner)
  )
    iziToast.error({
      title: 'Maximum candidates reached',
      message: 'Please deselect candidate(s) first, only 10 are allowed at a time',
    })
  else
    dispatch(toggleCandidatePure(payload))
}

/* Selectors */
export const getCandidates = state => fromState.getCandidates(state).candidates
export const getIds = state => getCandidates(state).map(candidate => candidate.nameWithOwner)
export const getCount = state => getCandidates(state).length
