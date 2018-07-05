import { combineReducers } from 'redux'
import candidates from './candidates'
import ui from './ui'

export default combineReducers({
  candidates,
  ui,
})

export const getCandidates = state => state.candidates
export const getUi = state => state.ui
