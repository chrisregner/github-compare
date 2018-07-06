import React from 'react'
import PropTypes from 'prop-types'
import { setPropTypes } from 'recompose'

const propTypes = { className: PropTypes.string }

export default Component => setPropTypes(propTypes)(({ className, ...props }) =>
  <div className={className}>
    <Component {...props} />
  </div>
)
