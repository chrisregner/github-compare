import 'tachyons/css/tachyons.min.css' // functional css library: http://tachyons.io
import React from 'react'
import PropTypes from 'prop-types'
import ReactLoading from 'react-loading'
import Repo from './Repo'

const App = ({
  inputValue,
  updateInputValue,
  step,
  repos,
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
      {{
        '0': () => null,
        '1': () => <ReactLoading className='mt5 center' type='spin' color='#333333' />,
        '2': () => repos.length
          ? <React.Fragment>
            <span className='dib gray mb3'>Matches:</span>
            {repos.map(repo => <Repo key={repo.full_name.replace('/', '__')} {...repo} />)}
          </React.Fragment>
          : <p className='gray'>Sorry, your search has no match.</p>,
        '2.1': () => <p className='light-red'>Sorry, an error encountered: {error.message}</p>,
      }[String(step)]()}
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
  step: PropTypes.number.isRequired,
  repos: PropTypes.array.isRequired,
  error: PropTypes.instanceOf(Error),
}

// TODO: Add prop types

export default App
