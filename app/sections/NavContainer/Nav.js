import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Nav = ({ candidatesCount, currentPathname }) =>
  <div className='gray f6'>
    <Link to='/' className={currentPathname === '/' ? 'blue b' : 'gray'}>
      Search
    </Link> |&ensp;
    <Link to='/compare' className={currentPathname === '/compare' ? 'blue b' : 'gray'}>
      Compare ({candidatesCount})
    </Link>
  </div>

Nav.propTypes = {
  candidatesCount: PropTypes.number.isRequired,
  currentPathname: PropTypes.string.isRequired,
}

export default Nav