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
          <span className='dib gray mb3'>Matches:</span>
          {searchResult.map(repo =>
            <div className='mb3'>
              <Repo key={repo.nameWithOwner.replace('/', '__')} {...repo} />
            </div>)}
        </React.Fragment>}

      {/* No Match */}
      {!loading && !!inputValue.trim() && searchResult && !searchResult.length
        && <p className='gray'>Sorry, your search has no match.</p>}

      {/* Error */}
      {error && <p className='light-red'>Sorry, an error encountered: {error.message}</p>}

      {/* Load More */}
      {!loading && !error && onLoadMore &&
        <button
          className='button-reset db br2 bn pa2 w-100 bg-dark-gray hover-bg-gray f6 white ttu'
          onClick={onLoadMore}
        >
          Load More
        </button>}

      {/* No More */}
      {!loading && !error && !onLoadMore && searchResult && !!searchResult.length &&
        <button
          className='button-reset db br2 bn pa2 w-100 bg-gray f6 white ttu'
          disabled
        >
          That's All Folks!
        </button>}

      {/* Loader */}
      {loading && <ReactLoading className='mt4 center' type='spin' color='#333333' />}
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
  loading: PropTypes.bool,
  error: PropTypes.instanceOf(Error),
  onLoadMore: PropTypes.func,
  inputValue: PropTypes.string.isRequired,
  updateInputValue: PropTypes.func.isRequired,
  searchResult: PropTypes.arrayOf(PropTypes.shape({
    nameWithOwner: PropTypes.string.isRequired,
  })),
}

export default App
