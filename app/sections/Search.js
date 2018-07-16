import 'tachyons/css/tachyons.min.css'
import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'
import ReactLoading from 'react-loading'
import Repo from 'app/components/Repo'
import SearchIcon from 'app/components/icons/SearchIcon'

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
  <div className='flex flex-column pa3 pa4-l min-vh-100'>
    <div>
      <h2 className='mb3'>
        <span className='mr2'>
          <SearchIcon svgProps={{ width: '.75em', height: '.75em' }} pathProps={{ fill: '#333' }} />
        </span>
        Search
      </h2>

      <input
        type='text'
        className='_input ba b--gray br2 pa2 w-100 f6'
        placeholder='Search Repo...'
        value={inputValue}
        onChange={e => updateInputValue(e.target.value)}
      />

      {searchResult && !!searchResult.length
        && <React.Fragment>
          <div className='mt4 cf gray'>
            <h4 className='fl'>Matches:</h4>
            <div className='fr f6'>(displaying {searchResult.length} of {repositoryCount})</div>
          </div>

          {searchResult.map((repo) => {
            const isAdded = candidateIds.includes(repo.nameWithOwner)

            return <div key={repo.nameWithOwner.replace('/', '__')} className='_repo flex mt3 bl bw1 b--light-silver'>
              <div className='ma3' style={{ flex: 1 }}>
                <Repo {...repo} />
              </div>
              <button onClick={() => toggleCandidate(repo)} className={c('bn br2 w2 f5 white', isAdded ? 'bg-blue' : 'bg-gray')}>
                {isAdded ? '-' : '+'}
              </button>
            </div>
          })}
        </React.Fragment>}
    </div>

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
          return <div className='flex-auto self-center flex flex-column justify-center pv3 pv4-l'>
            <ReactLoading type='spin' color='#333333' />
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

    <style jsx>{`
      /* custom styles */
      ._input:focus, ._input:hover {
        margin: -1px;
        border-width: 2px;
        outline: none;
      }

      ._repo:hover {
        margin-left: -1px;
        border-color: #357edd;
        border-width: 3px;
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
