import React from 'react'
import PropTypes from 'prop-types'
import withStyleableContainer from 'app/utils/withStyleableContainer'

const Candidates = ({ candidates }) =>
  <React.Fragment>
    {candidates.length
      ? candidates.map((cand, i) =>
        <span style={{ color: cand.color }} key={cand.name}>
          {cand.name}
          {i < candidates.length - 1 && ', '}
        </span>
      )
      : '(No repo selected)'}
  </React.Fragment>

Candidates.propTypes = {

  candidates: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  })).isRequired,
}

export default withStyleableContainer(Candidates)
