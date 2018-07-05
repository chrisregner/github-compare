import React from 'react'
import PropTypes from 'prop-types'
import d3 from 'app/services/d3'
import lighten from 'app/utils/lighten'
import BarChart from './Compare/BarChart'
import Repo from 'app/components/Repo'

const Compare = ({ candidates, toggleClickInspect, toggleHoverInspect, inspectedCandidate }) => {
  const colors = d3.schemeCategory10
  const specializedCandidates = candidates
    .map((c, i) => ({
      id: c.nameWithOwner,
      value: c.stargazerCount,
      color: colors[i],
      toggleClickInspect: () => toggleClickInspect(c.nameWithOwner),
      toggleHoverInspect: () => toggleHoverInspect(c.nameWithOwner),
    }))
    .sort((a, b) => a.value < b.value)

  return <div className='center mb4 w-100'>
    <div className="center mt3 ph3 ph4-l mw8">
      <BarChart
        candidates={specializedCandidates}
        inspectedCandidateId={inspectedCandidate && inspectedCandidate.nameWithOwner}
      />
    </div>

    <div className="center mt3 ph3 ph4-l mw7 lh-title">
      <h4 className="mb2 gray">Candidates:</h4>
      {candidates.map((c, i) =>
        <React.Fragment key={c.nameWithOwner}>
          {i !== 0 ? ', ' : ''}
          <a
            href='#'
            style={{
              color: colors[i],
              backgroundColor: c === inspectedCandidate ? lighten(colors[i]) : ''
            }}
            className='no-underline'
            onClick={() => toggleClickInspect(c.nameWithOwner)}
          >
            {c.nameWithOwner}
          </a>
        </React.Fragment>
      )}
    </div>

    {inspectedCandidate && <div className='center mt4 ph3 ph4-l mw7'>
      <div
        className='bl bw2 pa3'
        style={{ borderColor: colors[candidates.findIndex(c => c === inspectedCandidate)] }}
      >
        <Repo {...inspectedCandidate} />
      </div>
    </div>}
  </div>
}

Compare.propTypes = {
  candidates: PropTypes.arrayOf(PropTypes.shape({
    nameWithOwner: PropTypes.string.isRequired,
    stargazerCount: PropTypes.number.isRequired,
  })).isRequired,
  toggleClickInspect: PropTypes.func.isRequired,
  toggleHoverInspect: PropTypes.func.isRequired,
  inspectedCandidate: PropTypes.object,
}

export default Compare
