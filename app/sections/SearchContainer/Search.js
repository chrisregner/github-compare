import 'tachyons/css/tachyons.min.css'
import React from 'react'
import PropTypes from 'prop-types'
import ReactLoading from 'react-loading'
import Repo from './Search/Repo'

const Search = ({
  candidateIds,
  error,
  inputValue,
  onLoadMore,
  repositoryCount,
  searchResult,
  status = 'ready',
  toggleCandidate,
  updateInputValue,
}) =>
  <div className='center flex-auto flex flex-column ph3 ph4-l mw7 w-100'>
    <input
      type='text'
      className='ba b--gray br2 pa2 w-100 f6'
      placeholder='Search Repo...'
      value={inputValue}
      onChange={e => updateInputValue(e.target.value)}
    />

    <div className='flex-auto flex flex-column'>
      {/* Results */}
      {searchResult && !!searchResult.length
        && <React.Fragment>
          <div className="mt4 cf gray">
            <div className="fl">Matches:</div>
            <div className="fr f6">(displaying {searchResult.length} of {repositoryCount})</div>
          </div>
          {searchResult.map(repo =>
            <div key={repo.nameWithOwner.replace('/', '__')} className='mt3'>
              <Repo
                toggleCandidate={toggleCandidate.bind(null, repo)}
                isAdded={candidateIds.includes(repo.nameWithOwner)}
                {...repo}
              />
            </div>)}
        </React.Fragment>}

      {(() => {
        switch (status) {
          case 'can-load-more':
            return <div className='mt3'>
              <button
                className='button-reset db br2 bn pa2 w-100 bg-dark-gray hover-bg-gray f6 white ttu'
                onClick={onLoadMore}
              >
                Load More
              </button>
            </div>
          case 'error':
            return <p className='mt3 light-red'>Sorry, an error encountered: {error.message}</p>
          case 'loading':
            return <div className='flex-auto flex flex-column justify-center mt3 mb4'>
              <ReactLoading className='center' type='spin' color='#333333' />
            </div>
          case 'no-match':
            return <p className='mt3 gray'>Sorry, your search has no match.</p>
          case 'no-more':
            return <button
              className='button-reset mt3 br2 bn pa2 db w-100 bg-gray f6 white ttu'
              disabled
            >
              That's All Folks!
            </button>
        }
      })()}
    </div>

    <style jsx>{`
      /* custom styles */
      input:focus, input:hover {
        margin: -1px;
        border-width: 2px;
        outline: none;
      }
    `}</style>
  </div>

Search.propTypes = {
  candidateIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  error: PropTypes.instanceOf(Error),
  inputValue: PropTypes.string.isRequired,
  onLoadMore: PropTypes.func,
  repositoryCount: PropTypes.number,
  status: PropTypes.oneOf([
    'can-load-more',
    'error',
    'loading',
    'no-match',
    'no-more',
    'ready',
  ]),
  searchResult: PropTypes.arrayOf(PropTypes.shape({
    nameWithOwner: PropTypes.string.isRequired,
  })),
  toggleCandidate: PropTypes.func.isRequired,
  updateInputValue: PropTypes.func.isRequired,
}

export default Search
