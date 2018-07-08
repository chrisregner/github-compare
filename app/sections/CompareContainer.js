import { connect } from 'react-redux'
import { compose, withState } from 'recompose'
import { getCandidates } from 'app/state/candidates'
import { getInspected, toggleClickInspect, toggleHoverInspect } from 'app/state/ui'
import Compare from './CompareContainer/Compare'

export default compose(
  connect(
    state => ({
      candidates: getCandidates(state),
      inspectedCandidate: getInspected(state),
    }),
    { toggleClickInspect, toggleHoverInspect },
  ),

  // TODO: move this to redux?
  withState('graphType', 'setGraphType', 'Pull Requests'),
)(Compare)
