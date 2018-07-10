import { getCandidates } from 'app/state/candidates'
import { connect } from 'react-redux'
import Candidates from './CandidatesContainer/Candidates'

export default connect(state => ({ candidates: getCandidates(state) }))(Candidates)
