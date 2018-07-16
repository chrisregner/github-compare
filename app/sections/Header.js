import { push as Menu } from 'react-burger-menu'
import CandidatesContainer from './Header/CandidatesContainer'
import NavContainer from './Header/NavContainer'
import React from 'react'
import withContainerWidth from 'app/utils/withContainerWidth'
import PropTypes from 'prop-types'

const Header = ({ width }) => {
  const contents
    = <div className='min-vh-100 bg-dark-gray'>
      <h1 className='ph3 pt3 pb4 pt4-l f4 white'>Github Compare</h1>
      <NavContainer />
      <CandidatesContainer />
    </div>

  return width >= 600
    ? <div className='_container-outer'>
      <div className='_container-inner w5 fixed'>
        {contents}
      </div>
      <style jsx>{`
        ._container-outer { flex: 0 0 14rem; }
        ._container-inner { width: 14rem; }
      `}</style>
    </div>
    : <Menu width='14rem' pageWrapId='page-container' outerContainerId='outer-container'>
      {contents}
      <style jsx global>{MenuStyles}</style>
    </Menu>
}

Header.propTypes = {
  width: PropTypes.number,
}

const MenuStyles = `
  /* Position and sizing of burger button */
  .bm-burger-button {
    position: fixed;
    right: 1rem;
    top: 1rem;
    width: 2rem;
    height: 1.75rem

    ;
  }

  /* Color/shape of burger icon bars */
  .bm-burger-bars {
    background: #333;
  }

  /* Position and sizing of clickable cross button */
  .bm-cross-button {
    top: 1.25rem;
    height: 24px;
    width: 24px;
  }

  /* Color/shape of close button cross */
  .bm-cross {
    background: #fff;
  }

  /* Styling of overlay */
  .bm-overlay {
    background: rgba(0, 0, 0, 0.3);
  }
`

export default withContainerWidth()(Header)
