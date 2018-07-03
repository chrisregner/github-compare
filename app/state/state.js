import { combineReducers } from 'redux'
import candidates, * as fromRepos from './candidates'

export default combineReducers({
  candidates
})

export const getCandidates = state => state.candidates
