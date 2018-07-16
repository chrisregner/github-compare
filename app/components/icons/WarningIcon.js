import React from 'react'
import PropTypes from 'prop-types'

const WarningIcon = ({ svgProps = {}, pathProps = {} }) =>
  <svg xmlns='http://www.w3.org/2000/svg' {...svgProps} viewBox='0 0 24 24'>
    <path {...pathProps} d='M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.5 5h3l-1 10h-1l-1-10zm1.5 14.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z' />
  </svg>

WarningIcon.propTypes = {
  svgProps: PropTypes.object,
  pathProps: PropTypes.object,
}

export default WarningIcon
