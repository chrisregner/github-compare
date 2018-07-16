import React from 'react'
import ReactResizeDetector from 'react-resize-detector'

export default settings => Component => props =>
  <ReactResizeDetector handleWidth {...settings}>
    {width => <Component width={width} {...props} />}
  </ReactResizeDetector>
