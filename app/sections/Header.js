import CandidatesContainer from './Header/CandidatesContainer'
import NavContainer from './Header/NavContainer'
import React from 'react'
import withStyleableContainer from 'app/utils/withStyleableContainer'

const Header = () =>
  <div className='min-vh-100 bg-dark-gray'>
    <h1 className='ph3 pv4 f3 white'>Github Compare</h1>
    <NavContainer />
    <CandidatesContainer />
  </div>

export default withStyleableContainer(Header)
