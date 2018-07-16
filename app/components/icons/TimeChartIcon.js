import React from 'react'
import PropTypes from 'prop-types'

const TimeChartIcon = ({ svgProps = {}, pathProps = {} }) =>
  <svg xmlns='http://www.w3.org/2000/svg' {...svgProps} viewBox='0 0 24 24' fillRule='evenodd' clipRule='evenodd'>
    <path {...pathProps} d='M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 14h-7v-8h2v6h5v2z' />
  </svg>

TimeChartIcon.propTypes = {
  svgProps: PropTypes.object,
  pathProps: PropTypes.object,
}

export default TimeChartIcon
