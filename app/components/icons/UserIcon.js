import React from 'react'
import PropTypes from 'prop-types'

const UserIcon = ({ svgProps = {}, pathProps = {} }) =>
  <svg xmlns='http://www.w3.org/2000/svg' {...svgProps} viewBox='0 0 24 24'>
    <path {...pathProps} d='M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004 1h23.99l.004-.969c.012-2.688-.092-4.222-3.176-4.935z' />
  </svg>

UserIcon.propTypes = {
  svgProps: PropTypes.object,
  pathProps: PropTypes.object,
}

export default UserIcon
