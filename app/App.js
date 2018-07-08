import 'tachyons/css/tachyons.min.css' // functional css library: http://tachyons.io
import React from 'react'
import { Route } from 'react-router-dom'
import SearchContainer from 'app/sections/SearchContainer'
import CompareContainer from 'app/sections/CompareContainer'
import NavContainer from 'app/sections/NavContainer'

const App = () =>
  <div className='flex flex-column pv3 pv4-l min-vh-100 near-black sans-serif'>
    <div className='center mb3 ph3 ph4-l mw7 w-100 flex'>
      <h1 className='normal f3'>GitHub Search App</h1>
      <NavContainer className='flex-auto tr' />
    </div>

    <Route exact path='/' component={SearchContainer} />
    <Route path='/compare' component={CompareContainer} />

    <style jsx global>{`
      /* base global styles */
      h1, h2, h3, h4, h5, h6, p { margin: 0 }
      h1, h2, h3, h4, h5, h6 { font-weight: normal; }
    `}</style>
  </div>

export default App
