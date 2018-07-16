import { Link, matchPath } from 'react-router-dom'
import c from 'classnames'
import chartTypes from 'app/services/chartTypes'
import Collapse from 'react-collapse'
import PropTypes from 'prop-types'
import React from 'react'
import SearchIcon from 'app/components/icons/SearchIcon'
import CompareIcon from 'app/components/icons/CompareIcon'

const Nav = ({ location }) => {
  const locWithDefault = {
    pathname: chartTypes.addUrlDefault(location.pathname),
  }

  return <div className='_links white'>
    {(function renderLink (links, depth = 0, isParentMatch) {
      return links.map(({ title, children, to, exact, icon: Icon }) => {
        const isMatch = matchPath(locWithDefault.pathname, { path: to, exact })

        return <React.Fragment key={to}>
          <Link
            to={to}
            className={c(
              `_link _depth-${depth} flex items-center pr3 pv2 no-underline`,
              depth > 0 ? 'f7 moon-gray' : 'f5 white',
              !isMatch && 'bg-dark-gray',
              isMatch && depth > 0 && 'bg-white-10',
              isMatch && depth === 0 && 'bg-white-30',
            )}
          >
            <div className='mr2'>
              <Icon
                svgProps={{ height: '1rem', width: '1rem' }}
                pathProps={{ fill: depth > 0 ? '#ccc' : '#ccc' }}
              />
            </div>
            {title}
          </Link>

          {children
            && (depth === 1
              ? <Collapse isOpened={!!(isMatch && depth === 1)}>
                {renderLink(children, depth + 1, isMatch)}
              </Collapse>
              : renderLink(children, depth + 1, isMatch))}
        </React.Fragment>
      })
    })(links)}

    <style jsx>{`
      ._links :global(._link._depth-0),
      ._links :global(._link._depth-1) { padding-left: 1rem; }
      ._links :global(._link._depth-2) { padding-left: 1.5rem; }
      ._links :global(._link) { transition: background-color .25s linear; }
    `}</style>
  </div>
}

const links = [
  {
    title: 'Search',
    to: '/',
    icon: SearchIcon,
    exact: true,
  },
  {
    title: `Compare`,
    to: '/compare',
    icon: CompareIcon,
    children: chartTypes.getLinks(),
  },
]

Nav.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
}

export default Nav
