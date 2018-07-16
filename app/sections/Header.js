import { push as Menu } from 'react-burger-menu'
import CandidatesContainer from './Header/CandidatesContainer'
import NavContainer from './Header/NavContainer'
import React from 'react'
import withContainerWidth from 'app/utils/withContainerWidth'
import PropTypes from 'prop-types'

const Header = ({ width }) => {
  const contents
    = <div className='relative min-vh-100 bg-dark-gray pb5'>
      <h1 className='mh3 mb2 pt3 pt4-l f4 white lh-solid'>Github Compare</h1>
      <p className='mh3 mb4 f7 lh-title moon-gray i'>Search Repositories, Select, and&nbsp;Compare</p>

      <NavContainer />

      <div className='pt4 pb3 ph3 f6'>
        <div className='mb1 silver lh-solid'>Selected Repos:</div>
        <CandidatesContainer className='lh-copy silver' />
      </div>

      <div className='absolute bottom-0 pa3 lh-title f7 silver'>
        By
        {' '}<a href='http://chrisregner.com/' className='gray'>
          Christopher Regner
        </a>. <br />
        View source
        {' '}<a href='https://github.com/chrisregner/github-compare' className='gray'>
          here
        </a>.
      </div>
    </div>

  return width >= 720
    ? <div className='_container-outer'>
      <div className='_container-inner fixed h-100 w5 overflow-auto'>
        {contents}
      </div>
      <style jsx>{`
        ._container-outer { flex: 0 0 14rem; }
        ._container-inner { width: 14rem; }
      `}</style>
    </div>
    : <Menu width='14rem' pageWrapId='page-container' outerContainerId='outer-container'>
      {contents}
      <style jsx global>{`
        /* Position and sizing of burger button */
        .bm-burger-button {
          position: fixed;
          right: 1rem;
          top: 1rem;
          width: 2rem;
          height: 1.75rem;
        }

        /* Color/shape of burger icon bars */
        .bm-burger-bars { background: #333; }

        /* Position and sizing of clickable cross button */
        .bm-cross-button {
          top: 1.25rem;
          height: 24px;
          width: 24px;
        }

        /* Color/shape of close button cross */
        .bm-cross { background: #fff; }

        /* Styling of overlay */
        .bm-overlay { background: rgba(0, 0, 0, 0.3); }
      `}</style>
    </Menu>
}

Header.propTypes = {
  width: PropTypes.number,
}

export default withContainerWidth()(Header)
