import 'tachyons/css/tachyons.min.css' // functional css library: http://tachyons.io
import React from 'react'
import { Route } from 'react-router-dom'
import Search from 'app/sections/SearchContainer'
import NavContainer from 'app/sections/NavContainer'

const App = () =>
  <div className='center pa3 pa4-l mb4 mw7 near-black sans-serif'>
    <h1 className='normal mb3'>GitHub Search App</h1>

    <NavContainer className="mb2" />
    <Route exact path='/' component={Search} />

    <style jsx global>{`
      /* base global styles */
      h1, h2, h3, h4, h5, h6, p { margin: 0 }
    `}</style>
  </div>

export default App
