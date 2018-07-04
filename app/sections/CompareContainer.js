import { connect } from 'react-redux'
import { getCandidates } from 'app/state/candidates'
import Compare from './CompareContainer/Compare'

export default connect(state => ({ candidates: getCandidates(state) }))(Compare)
