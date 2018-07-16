import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import qs from 'query-string'
import React from 'react'

const NotFound = ({ location }) =>
  <div className='pa4 gray'>
    Sorry, the page
    {` `}<span className='code'>
      {qs.parse(location.search).referrer || location.pathname}
    </span>{` `}
    doesn’t exist.
  </div>

NotFound.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string,
  }).isRequired,
}

export default withRouter(NotFound)
