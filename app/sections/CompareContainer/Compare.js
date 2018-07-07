import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import lighten from 'app/utils/lighten'
import BarChart from './Compare/BarChart'
import Repo from 'app/components/Repo'
import * as R from 'ramda'

const COLORS = d3.schemeCategory10
const TYPE_NAME_SYMB = Symbol('Pretty name for propToName objects (properties for ALL_PROP_TO_NAME)')
const ALL_PROP_TO_NAME = {
  int: {
    [TYPE_NAME_SYMB]: 'Bar Graphs',
    stargazerCount: 'Stars',
    forkCount: 'Forks',
    openIssueCount: 'Open Issues',
    watcherCount: 'Watchers',
  },
  date: {
    [TYPE_NAME_SYMB]: 'Timeline Graphs',
    createdAt: 'Creation Date',
    updatedAt: 'Update Date',
  },
  special: {
    [TYPE_NAME_SYMB]: 'Specialized Graphs',
    ageGraph: 'Age Graph',
    issuesGraph: 'Issues Graph',
  },
}

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
      <h4 className='mb2 f5'>Bar Graphs</h4>
      {Object.entries(ALL_PROP_TO_NAME.int).map(([prop, name], i) =>
        <button
          key={prop}
          value={prop}
          className={`bn br2 mr2 pa1 f6 white${prop === graphType ? ' bg-blue' : ' bg-gray'}`}
          onClick={(ev) => {
            ev.preventDefault()
            setGraphType(prop)
          }}
        >
          {name}
        </button>
      )}
    </div>

    {(() => {
      switch (getTypeFromProp(graphType)) {
        case 'int':
          return <BarChart
            className='center mt4 ph3 ph4-l mw8'
            propName={getNameFromProp(graphType)}
            inspectedCandidateId={inspectedCandidate && inspectedCandidate.nameWithOwner}
            candidates={specializeCandsMem(props)}
          />
      }
    })()}

    <div className='center mt3 ph3 ph4-l mw7 lh-title'>
      <h4 className='mb2 gray'>Candidates:</h4>
      {candidates.map((c, i) =>
        <React.Fragment key={c.nameWithOwner}>
          {i !== 0 ? ', ' : ''}
          <a
            href='#'
            style={{
              color: COLORS[i],
              backgroundColor: c === inspectedCandidate ? lighten(COLORS[i]) : '',
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
        style={{ borderColor: COLORS[candidates.findIndex(c => c === inspectedCandidate)] }}
      >
        <Repo {...inspectedCandidate} />
      </div>
    </div>}
  </div>
}

const specializeCands = ({ candidates, graphType, toggleClickInspect, toggleHoverInspect }) =>
  candidates
    .map((c, i) => ({
      id: c.nameWithOwner,
      value: c[graphType],
      color: COLORS[i],
      toggleClickInspect: () => toggleClickInspect(c.nameWithOwner),
      toggleHoverInspect: () => toggleHoverInspect(c.nameWithOwner),
    }))
    .sort((a, b) => a.value < b.value)

const specializeCandsMem = R.memoizeWith(
  ({ candidates, graphType }) => JSON.stringify(candidates) + graphType,
  specializeCands)

const getTypeFromProp = prop =>
  Object.entries(ALL_PROP_TO_NAME)
    .find(([type, propToName]) =>
      Object.keys(propToName).includes(prop)
    )[0]

// TODO: use or remove
// const getTypeNameFromProp = prop =>
//   Object.entries(ALL_PROP_TO_NAME)
//     .find(([type, propToName]) =>
//       Object.keys(propToName).includes(prop)
//     )[1][TYPE_NAME_SYMB]

const getNameFromProp = (prop) => {
  for (let type in ALL_PROP_TO_NAME)
    for (let innerProp in ALL_PROP_TO_NAME[type])
      if (innerProp === prop)
        return ALL_PROP_TO_NAME[type][innerProp]
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
