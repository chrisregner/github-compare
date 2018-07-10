import 'tachyons/css/tachyons.min.css' // functional css library: http://tachyons.io
import React from 'react'
import { Route } from 'react-router-dom'
import SearchContainer from 'app/sections/SearchContainer'
import CompareContainer from 'app/sections/CompareContainer'
import Header from 'app/sections/Header'

const App = () =>
  <div className='flex near-black sans-serif'>
    <div className='mw5 w-100'>
      <Header className='fixed mw5 w-100' />
    </div>

    <div className='flex-auto mw8'>
      <Route exact path='/' component={SearchContainer} />
      <Route path='/compare/:cat?/:type?' component={CompareContainer} />
    </div>

    <style jsx global>{`
      /* base global styles */
      h1, h2, h3, h4, h5, h6, p { margin: 0 }
      h1, h2, h3, h4, h5, h6 { font-weight: normal; }
    `}</style>
  </div>

export default App
