import React from 'react'
import PropTypes from 'prop-types'
import format from 'date-fns/format'
import CalendarIcon from '../icons/CalendarIcon'
import EyeIcon from '../icons/EyeIcon'
import ForkIcon from '../icons/ForkIcon'
import LinkIcon from '../icons/LinkIcon'
import PencilIcon from '../icons/PencilIcon'
import StarIcon from '../icons/StarIcon'
import UserIcon from '../icons/UserIcon'
import WarningIcon from '../icons/WarningIcon'

const Repo = ({
  name,
  full_name,
  html_url,
  description,
  created_at,
  updated_at,
  stargazers_count,
  open_issues_count,
  watchers_count,
  forks_count,
  owner_name,
  owner_url,
}) =>
  <div className='_wrapper mb4 bl bw1 b--light-silver pv2 pl3'>
    <div className="flex flex-wrap items-center mb2">
      <h2 className='pr3 f4 normal lh-title'>{name}</h2>
      <span className='pr1'>
        <LinkIcon width='.75em' height='.75em' color='#555555' />
      </span>
      <span className="dib f6">
        <a href={html_url} className='blue no-underline'>{full_name}</a>
      </span>
    </div>

    <div className='flex flex-wrap items-center mb2 f7 gray'>
      <span className='pr1'>
        <UserIcon width='1em' height='1em' color='#555555' />
      </span>
      <a href={owner_url} className='mr3 blue no-underline'>{owner_name}</a>

      <span className='pr1'>
        <CalendarIcon width='1em' height='1em' color='#555555' />
      </span>
      <span className='mr3'>{format(new Date(created_at), 'MM/DD/YY')}</span>

      <span className='pr1'>
        <PencilIcon width='1em' height='1em' color='#555555' />
      </span>
      <span className='mr3'>{format(new Date(updated_at), 'MM/DD/YY')}</span>

      <span className='pr1'>
        <StarIcon width='1.2em' height='1.2em' color='#555555' />
      </span>
      <span className='mr3'>{stargazers_count}</span>

      <span className='pr1'>
        <WarningIcon width='1em' height='1em' color='#555555' />
      </span>
      <span className='mr3'>{open_issues_count}</span>

      <span className='pr1'>
        <EyeIcon width='1.5em' height='1.5em' color='#555555' />
      </span>
      <span className='mr3'>{watchers_count}</span>
    </div>

    {description
      ? <p className='f6 lh-copy'>{description}</p>
      : <p className='f6 lh-copy gray'>(No description provided)</p>}
  </div>

Repo.propTypes = {
  name: PropTypes.string.isRequired,
  full_name: PropTypes.string.isRequired,
  html_url: PropTypes.string.isRequired,
  description: PropTypes.string,
  created_at: PropTypes.string.isRequired,
  updated_at: PropTypes.string.isRequired,
  stargazers_count: PropTypes.number.isRequired,
  open_issues_count: PropTypes.number.isRequired,
  watchers_count: PropTypes.number.isRequired,
  forks_count: PropTypes.number.isRequired,
  owner_name: PropTypes.string.isRequired,
  owner_url: PropTypes.string.isRequired,
}

export default Repo