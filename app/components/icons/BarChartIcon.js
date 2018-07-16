import React from 'react'
import PropTypes from 'prop-types'

const BarChartIcon = ({ svgProps = {}, pathProps = {} }) =>
  <svg xmlns='http://www.w3.org/2000/svg' {...svgProps} viewBox='0 0 24 24'>
    <path {...pathProps} d='M7 19h-6v-11h6v11zm8-18h-6v18h6v-18zm8 11h-6v7h6v-7zm1 9h-24v2h24v-2z' />
  </svg>

BarChartIcon.propTypes = {
  svgProps: PropTypes.object,
  pathProps: PropTypes.object,
}

export default BarChartIcon
