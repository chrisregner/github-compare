import 'tachyons/css/tachyons.min.css' // functional css library: http://tachyons.io
import React from 'react'
import PropTypes from 'prop-types'
import ReactLoading from 'react-loading'
import Repo from './Repo'

const App = ({
  inputValue,
  updateInputValue,
  searchResult,
  loading,
  error,
}) =>
  <div className='center pa3 pa4-l mw7 near-black sans-serif'>
    <h1 className='normal mb4'>GitHub Search App</h1>

    <input
      type='text'
      className='ba b--gray br3 pa2 w-100 f6'
      placeholder='Search Repo...'
      value={inputValue}
      onChange={e => updateInputValue(e.target.value)}
    />

    <div className='pt4'>
      {!loading && searchResult && searchResult.length > 0
        && <React.Fragment>
          <span className='dib gray mb3'>Matches:</span>
          {searchResult.map(repo => <Repo key={repo.nameWithOwner.replace('/', '__')} {...repo} />)}
        </React.Fragment>}

      {!loading && !!inputValue.trim() && searchResult && searchResult.length === 0
        && <p className='gray'>Sorry, your search has no match.</p>}

      {error && <p className='light-red'>Sorry, an error encountered: {error.message}</p>}
      {loading && <ReactLoading className='mt5 center' type='spin' color='#333333' />}
    </div>

    <style jsx>{`
      /* base global styles */
      :global(h1),
      :global(h2),
      :global(h3),
      :global(h4),
      :global(h5),
      :global(h6),
      :global(p) { margin: 0 }

      /* custom styles */
      input:focus {
        margin: -1px;
        border-width: 2px;
        outline: none;
      }
    `}</style>
  </div>

App.propTypes = {
  inputValue: PropTypes.string.isRequired,
  updateInputValue: PropTypes.func.isRequired,
  searchResult: PropTypes.arrayOf(PropTypes.shape({
    nameWithOwner: PropTypes.string.isRequired,
  })),
  error: PropTypes.instanceOf(Error),
  loading: PropTypes.bool.isRequired,
}

export default App
