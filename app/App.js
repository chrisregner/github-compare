import 'tachyons/css/tachyons.min.css' // functional css library: http://tachyons.io
import React from 'react'
import { Route } from 'react-router-dom'
import SearchContainer from 'app/sections/SearchContainer'
import CompareContainer from 'app/sections/CompareContainer'
import NavContainer from 'app/sections/NavContainer'

const App = () =>
  <div className='pv3 pv4-l mb4 near-black sans-serif'>
    <h1 className='center mb3 mw7 ph3 ph4-l normal'>GitHub Search App</h1>

    <NavContainer className="center mb3 mw7 ph3 ph4-l" />
    <Route exact path='/' component={SearchContainer} />
    <Route path='/compare' component={CompareContainer} />

    <style jsx global>{`
      /* base global styles */
      h1, h2, h3, h4, h5, h6, p { margin: 0 }
    `}</style>
  </div>

export default App
