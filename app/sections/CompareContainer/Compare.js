import React from 'react'
import PropTypes from 'prop-types'

import BarChart from './Compare/BarChart'

const Compare = ({ candidates, width }) => {
  return <div className='center pt5 ph3 ph4-l mw8 w-100'>
    <BarChart
      candidates={candidates.map(c => ({ id: c.nameWithOwner, value: c.stargazerCount }))}
      width={width}
      label='star(s)'
    />
  </div>
}

Compare.propTypes = {
  candidates: PropTypes.arrayOf(PropTypes.shape({
    nameWithOwner: PropTypes.string.isRequired,
    stargazerCount: PropTypes.number.isRequired,
  })).isRequired,
  width: PropTypes.number.isRequired,
}

export default Compare
