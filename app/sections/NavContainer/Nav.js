import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'
import { Link } from 'react-router-dom'

const Nav = ({ candidatesCount, currentPathname }) =>
  <div className='gray f5'>
    <Link to='/' className={c(
      'bn br2 mr2 pa1 f5 white no-underline',
      currentPathname === '/' ? ' bg-blue' : ' bg-gray',
    )}>
      Search
    </Link>
    <Link to='/compare' className={c(
      'bn br2 mr2 pa1 f5 white no-underline',
      currentPathname === '/compare' ? ' bg-blue' : ' bg-gray',
    )}>
      Compare ({candidatesCount})
    </Link>
  </div>

Nav.propTypes = {
  candidatesCount: PropTypes.number.isRequired,
  currentPathname: PropTypes.string.isRequired,
}

export default Nav
