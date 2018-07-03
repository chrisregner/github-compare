import 'tachyons/css/tachyons.min.css' // functional css library: http://tachyons.io
import React from 'react'
import PropTypes from 'prop-types'
import ReactLoading from 'react-loading'
import Repo from './Repo'

const App = ({
  inputValue,
  updateInputValue,
  repositoryCount,
  searchResult,
  status = 'ready',
  error,
  onLoadMore,
}) =>
  <div className='center pa3 pa4-l mb4 mw7 near-black sans-serif'>
    <h1 className='normal mb4'>GitHub Search App</h1>

    <input
      type='text'
      className='ba b--gray br2 pa2 w-100 f6'
      placeholder='Search Repo...'
      value={inputValue}
      onChange={e => updateInputValue(e.target.value)}
    />

    <div className='pt4'>
      {/* Results */}
      {searchResult && !!searchResult.length
        && <React.Fragment>
          <div className="cf gray mb3">
            <div className="fl">Matches:</div>
            <div className="fr f6">(displaying {searchResult.length} of {repositoryCount})</div>
          </div>
          {searchResult.map(repo =>
            <div key={repo.nameWithOwner.replace('/', '__')} className='mb3'>
              <Repo {...repo} />
            </div>)}
        </React.Fragment>}

      {(() => {
        switch (status) {
          case 'can-load-more':
            return <button
              className='button-reset db br2 bn pa2 w-100 bg-dark-gray hover-bg-gray f6 white ttu'
              onClick={onLoadMore}
            >
              Load More
            </button>
          case 'error':
            return <p className='light-red'>Sorry, an error encountered: {error.message}</p>
          case 'loading':
            return <ReactLoading className='mt4 center' type='spin' color='#333333' />
          case 'no-match':
            return <p className='gray'>Sorry, your search has no match.</p>
          case 'no-more':
            return <button
              className='button-reset db br2 bn pa2 w-100 bg-gray f6 white ttu'
              disabled
            >
              That's All Folks!
            </button>
        }
      })()}
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
      input:focus, input:hover {
        margin: -1px;
        border-width: 2px;
        outline: none;
      }
    `}</style>
  </div>

App.propTypes = {
  error: PropTypes.instanceOf(Error),
  onLoadMore: PropTypes.func,
  inputValue: PropTypes.string.isRequired,
  updateInputValue: PropTypes.func.isRequired,
  repositoryCount: PropTypes.number,
  searchResult: PropTypes.arrayOf(PropTypes.shape({
    nameWithOwner: PropTypes.string.isRequired,
  })),
  status: PropTypes.oneOf([
    'can-load-more',
    'error',
    'loading',
    'no-match',
    'no-more',
    'ready',
  ]),
}

export default App
