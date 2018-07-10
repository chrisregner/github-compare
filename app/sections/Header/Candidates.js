import React from 'react'
import PropTypes from 'prop-types'

const Candidates = ({ candidates }) =>
  <div className='pt4 pb3 ph3 f6 silver lh-copy'>
    <div className='mb2'>Selected Repos:</div>
    {candidates.length
      ? candidates.map((cand, i) =>
        <span style={{ color: cand.color }} key={cand.name}>
          {cand.name}
          {i < candidates.length - 1 && ', '}
        </span>
      )
      : '(No repo selected)'}
  </div>

Candidates.propTypes = {
  candidates: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  })).isRequired,
}

export default Candidates
