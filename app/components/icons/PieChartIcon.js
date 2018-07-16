import React from 'react'
import PropTypes from 'prop-types'

const PieChartIcon = ({ svgProps = {}, pathProps = {} }) =>
  <svg xmlns='http://www.w3.org/2000/svg' {...svgProps} viewBox='0 0 24 24'>
    <path {...pathProps} d='M13.012 5.007v-1.668l2.802-2.771c.409.136.809.293 1.197.471l-3.999 3.968zm7.089-1.93l-7.089 7.058v.853h.877l7.044-7.076c-.263-.292-.541-.57-.832-.835zm-7.089-1.468l1.437-1.406c-.46-.094-.96-.163-1.437-.203v1.609zm10.789 7.962l-1.386 1.417h1.585c-.04-.47-.106-.964-.199-1.417zm-.363-1.366c-.135-.41-.292-.81-.469-1.199l-3.951 3.982h1.668l2.752-2.783zm-1.063-2.337c-.205-.346-.426-.682-.664-1.004l-6.093 6.124h1.668l5.089-5.12zm-3.225-3.57c-.322-.238-.657-.459-1.003-.665l-5.135 5.104v1.668l6.138-6.107zm-8.15 10.702v-13c-6.161.519-11 5.683-11 11.978 0 6.639 5.382 12.022 12.021 12.022 6.296 0 11.46-4.839 11.979-11h-13z' />
  </svg>

PieChartIcon.propTypes = {
  svgProps: PropTypes.object,
  pathProps: PropTypes.object,
}

export default PieChartIcon
