import 'tachyons/css/tachyons.min.css' // functional css library: http://tachyons.io
import React from 'react'
import { Switch, Route } from 'react-router-dom'
import SearchContainer from 'app/sections/SearchContainer'
import CompareContainer from 'app/sections/CompareContainer'
import Header from 'app/sections/Header'
import NotFound from 'app/sections/NotFound'

const App = () =>
  <div id='outer-container' className='flex near-black sans-serif'>
    <Header />

    <div id='page-container' className='flex-auto mw8'>
      <Switch>
        <Route exact path='/' component={SearchContainer} />
        <Route path='/compare/:cat?/:type?' component={CompareContainer} />
        <Route component={NotFound} />
      </Switch>
    </div>

    <style jsx global>{`
      html {
        font-size: 15px;
        min-width: 320px;
      }

      /* base global styles */
      h1, h2, h3, h4, h5, h6, p { margin: 0 }
      h1, h2, h3, h4, h5, h6 { font-weight: normal; }

      @media screen and (min-width: 420px) {
        html { font-size: 16px; }
      }
    `}</style>
  </div>

export default App
