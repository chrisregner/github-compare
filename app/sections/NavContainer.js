import { connect } from 'react-redux'
import { compose, withProps } from 'recompose'
import { withRouter } from 'react-router-dom'
import { getCount } from 'app/state/candidates'
import Nav from './NavContainer/Nav'
import withStyleableContainer from 'app/utils/withStyleableContainer'

export default compose(
  withStyleableContainer,
  withRouter,
  withProps(({ location }) => ({ currentPathname: location.pathname })),
  connect(state => ({ candidatesCount: getCount(state) })),
)(Nav)
