import { connect } from 'react-redux'
import { getInspected } from 'app/state/ui'
import { getCount } from 'app/state/candidates'
import Compare from './CompareContainer/Compare'

export default connect(state => ({
  inspectedCandidate: getInspected(state),
  candidatesCount: getCount(state),
}))(Compare)
