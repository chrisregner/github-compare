import React from 'react'
import PropTypes from 'prop-types'
import d3 from 'app/services/d3'
import lighten from 'app/utils/lighten'
import BarChart from './Compare/BarChart'
import Repo from 'app/components/Repo'

const colors = d3.schemeCategory10
const Compare = ({
  candidates,
  toggleClickInspect,
  toggleHoverInspect,
  inspectedCandidate,
  graphType,
  setGraphType,
}) => {
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
          className={`bn br3 mr2 pa1 f6 white${prop === graphType ? ' bg-blue' : ' bg-gray'}`}
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
            candidates={
              candidates
                .map((c, i) => ({
                  id: c.nameWithOwner,
                  value: c[graphType],
                  color: colors[i],
                  toggleClickInspect: () => toggleClickInspect(c.nameWithOwner),
                  toggleHoverInspect: () => toggleHoverInspect(c.nameWithOwner),
                }))
                .sort((a, b) => a.value < b.value)
            }
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

const typeNameSymb = Symbol('Pretty name for propToName objects (properties for ALL_PROP_TO_NAME)')
const ALL_PROP_TO_NAME = {
  int: {
    [typeNameSymb]: 'Bar Graphs',
    forkCount: 'Forks',
    openIssueCount: 'Open Issues',
    stargazerCount: 'Stars',
    watcherCount: 'Watchers',
  },
  date: {
    [typeNameSymb]: 'Timeline Graphs',
    createdAt: 'Creation Date',
    updatedAt: 'Update Date',
  },
  special: {
    [typeNameSymb]: 'Specialized Graphs',
    ageGraph: 'Age Graph',
    issuesGraph: 'Issues Graph',
  },
}

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
//     )[1][typeNameSymb]

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
