import React from 'react'

export default Component => ({ className, ...props }) =>
  <div className={className}>
    <Component {...props} />
  </div>
