import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import lighten from 'app/utils/lighten'
import BarChart from './Compare/BarChart'
import PieChart from './Compare/PieChart'
import Repo from 'app/components/Repo'
import * as R from 'ramda'

const Compare = (props) => {
  const {
    candidates,
    toggleClickInspect,
    inspectedCandidate,
    graphType,
    setGraphType,
  } = props

  if (!candidates.length)
    return <div className='center mb4 w-100'>
      <div className='center mt2 ph3 ph4-l mw7 gray'>
        Please select candidates first.
      </div>
    </div>

  return <div className='center mb4 w-100'>
    <div className='center mt3 ph3 ph4-l mw7 gray'>
      <div className='flex nl2 nr2'>
        {Object.entries(CHART_TYPES).map(([chartType, keys]) =>
          <div className='ph2' key={chartType}>
            <h4 className='mb2 f5'>{chartType}</h4>
            {Object.entries(keys).map(([key, prettyName], i) =>
              <button
                key={key}
                value={key}
                className={`bn br2 mr2 pa1 f6 white${key === graphType ? ' bg-blue' : ' bg-gray'}`}
                onClick={(ev) => {
                  ev.preventDefault()
                  setGraphType(key)
                }}
              >
                {prettyName}
              </button>
            )}
          </div>
        )}
      </div>
    </div>

    <div className="center mt4 ph3 ph4-l mw8">
      {(() => {
        switch (getTypeNameFromKey(graphType)) {
          case 'Bar Charts':
            return <BarChart
              dataKeyName={getKeyNameFromKey(graphType)}
              inspectedCandidateId={inspectedCandidate && inspectedCandidate.nameWithOwner}
              candidates={cachedSpecializeData(props)}
            />
          case 'Pie Charts':
            return <PieChart
              dataKeyName={getKeyNameFromKey(graphType)}
              inspectedCandidateId={inspectedCandidate && inspectedCandidate.nameWithOwner}
              candidates={cachedSpecializeData(props)}
            />
        }
      })()}
    </div>

    <div className='center mt3 ph3 ph4-l mw7 lh-title'>
      <h4 className='mb2 gray'>Candidates:</h4>
      {candidates.map((c, i) =>
        <React.Fragment key={c.nameWithOwner}>
          {i !== 0 ? ', ' : ''}
          <a
            href='#'
            style={{
              color: colors[i],
              backgroundColor: c === inspectedCandidate ? lighten(colors[i]) : '',
            }}
            className='no-underline'
            onClick={(ev) => {
              ev.preventDefault()
              toggleClickInspect(c.nameWithOwner)
            }}
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

const colors = d3.schemeCategory10.map(lighten(0.0375))
colors[8] = '#ffd43b'

const CHART_TYPES = {
  'Bar Charts': {
    stargazerCount: 'Stars',
    forkCount: 'Forks',
    openIssueCount: 'Open Issues',
    watcherCount: 'Watchers',
  },
  'Timeline Charts': {
    age: 'Age (Creation/Update)',
  },
  'Pie Charts': {
    pullReq: 'Pull Requests',
    issue: 'Issues',
  },
}

const specializeCands = ({ candidates, graphType, toggleClickInspect, toggleHoverInspect }) =>
  candidates
    .map((c, i) => ({
      id: c.nameWithOwner,
      value: c[graphType],
      color: colors[i],
      toggleClickInspect: () => toggleClickInspect(c.nameWithOwner),
      toggleHoverInspect: () => toggleHoverInspect(c.nameWithOwner),
    }))
    .sort((a, b) => a.value < b.value)

const cachedSpecializeData = R.memoizeWith(
  ({ candidates, graphType }) => JSON.stringify(candidates) + graphType,
  specializeCands)

const getTypeNameFromKey = prop =>
  Object.entries(CHART_TYPES)
    .find(([type, propToName]) =>
      Object.keys(propToName).includes(prop)
    )[0]

const getKeyNameFromKey = (prop) => {
  for (let type in CHART_TYPES)
    for (let innerProp in CHART_TYPES[type])
      if (innerProp === prop)
        return CHART_TYPES[type][innerProp]
}

Compare.propTypes = {
  candidates: PropTypes.arrayOf(PropTypes.shape({
    nameWithOwner: PropTypes.string.isRequired,
    stargazerCount: PropTypes.number.isRequired,
  })).isRequired,
  toggleClickInspect: PropTypes.func.isRequired,
  toggleHoverInspect: PropTypes.func.isRequired,
  inspectedCandidate: PropTypes.object,
  graphType: PropTypes.string.isRequired,
  setGraphType: PropTypes.func.isRequired,
}

export default Compare
