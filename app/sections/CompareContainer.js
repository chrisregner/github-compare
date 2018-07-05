import { connect } from 'react-redux'
import { getCandidates } from 'app/state/candidates'
import { getInspected, toggleClickInspect, toggleHoverInspect } from 'app/state/ui'
import Compare from './CompareContainer/Compare'

export default connect(
  state => ({
    candidates: getCandidates(state),
    inspectedCandidate: getInspected(state),
  }),
  { toggleClickInspect, toggleHoverInspect },
)(Compare)
