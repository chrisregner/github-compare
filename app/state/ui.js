import { handleActions, createAction } from 'redux-actions'
import { getUi } from 'app/state'
import { getCandidates } from 'app/state/candidates'

/* Action Types */
const TOGGLE_CLICK_INSPECT = 'gihub-search/ui/TOGGLE_CLICK_INSPECT'
const TOGGLE_HOVER_INSPECT = 'gihub-search/ui/TOGGLE_HOVER_INSPECT'

/* Redux */
const defaultState = {
  inspectedClickId: null,
  inspectedHoverId: null,
}

export default handleActions({

  [TOGGLE_CLICK_INSPECT]: (state, { payload }) =>
    ({
      ...state,
      inspectedClickId: state.inspectedClickId === payload ? null : payload,
    }),

  [TOGGLE_HOVER_INSPECT]: (state, { payload }) =>
    ({
      ...state,
      inspectedHoverId: state.inspectedHoverId === payload ? null : payload,
    }),

}, defaultState)

/* Action Creators */
export const toggleClickInspect = createAction(TOGGLE_CLICK_INSPECT)
export const toggleHoverInspect = createAction(TOGGLE_HOVER_INSPECT)

/* Selectors */
export const getInspectedId = state =>
  getUi(state).inspectedHoverId || getUi(state).inspectedClickId

export const getInspected = (state) => {
  const inspectedId = getInspectedId(state)
  return inspectedId && getCandidates(state).find(c => c.nameWithOwner === inspectedId)
}
