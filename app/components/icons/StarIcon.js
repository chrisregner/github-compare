import React from 'react'
import PropTypes from 'prop-types'

const StarIcon = ({ svgProps, pathProps }) =>
  <svg xmlns='http://www.w3.org/2000/svg' {...svgProps} viewBox='0 0 24 24'>
    <path {...pathProps} d='M12 .288l2.833 8.718h9.167l-7.417 5.389 2.833 8.718-7.416-5.388-7.417 5.388 2.833-8.718-7.416-5.389h9.167z' />
  </svg>

StarIcon.propTypes = {
  svgProps: PropTypes.object.isRequired,
  pathProps: PropTypes.object.isRequired,
}

export default StarIcon
