import ChartContainer from './Compare/ChartContainer'
import PropTypes from 'prop-types'
import React from 'react'
import Repo from 'app/components/Repo'

const Compare = ({ candidatesCount, inspectedCandidate, ...props }) =>
  candidatesCount
    ? <div className='pa3 pa4-l'>
      <ChartContainer className='mb4' {...props} />

      <div
        className='_inspected-wrapper bl bw2 pa3'
        style={{ borderColor: inspectedCandidate ? inspectedCandidate.color : 'gray' }}
      >
        {inspectedCandidate
          ? <Repo {...inspectedCandidate} />
          : <span className='gray lh-copy'>
              Click or hover on a candidate (on chart or on list) to view more info
          </span>}
      </div>

      <style jsx>{`
        ._inspected-wrapper { min-height: 7rem; }
      `}</style>
    </div>
    : <div className='pa3 pa4-l gray'>
      Please select candidates first.
    </div>

Compare.propTypes = {
  inspectedCandidate: PropTypes.object,
  candidatesCount: PropTypes.number.isRequired,
}

export default Compare
