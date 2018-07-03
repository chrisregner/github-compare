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

/* eslint-disable camelcase */
const Repo = ({
  name,
  nameWithOwner,
  githubUrl,
  description,
  createdAt,
  updatedAt,
  forkCount,
  stargazerCount,
  openIssueCount,
  watcherCount,
  ownerUsername,
  ownerGithubUrl,
}) =>
  <div className='_wrapper bl bw1 b--light-silver pa3'>
    <div className='flex flex-wrap items-center mb2'>
      <h2 className='pr3 f4 normal lh-title'>{name}</h2>

      <span className="flex items-center">
        <span className='pr1'>
          <LinkIcon width='.75em' height='.75em' color='#555555' />
        </span>
        <span className='dib f6'>
          <a href={githubUrl} className='blue no-underline'>{nameWithOwner}</a>
        </span>
      </span>
    </div>

    <div className='flex flex-wrap items-center mb2 f7 gray'>
      <span className="flex items-center">
        <span className='pr1'>
          <UserIcon width='1em' height='1em' color='#555555' />
        </span>
        <a href={ownerGithubUrl} className='mr3 blue no-underline'>{ownerUsername}</a>
      </span>

      <span className="flex items-center">
        <span className='pr1'>
          <CalendarIcon width='1em' height='1em' color='#555555' />
        </span>
        <span className='mr3'>{format(new Date(createdAt), 'MM/DD/YY')}</span>
      </span>

      <span className="flex items-center">
        <span className='pr1'>
          <PencilIcon width='1em' height='1em' color='#555555' />
        </span>
        <span className='mr3'>{format(new Date(updatedAt), 'MM/DD/YY')}</span>
      </span>

      <span className="flex items-center">
        <span className='pr1'>
          <StarIcon width='1.2em' height='1.2em' color='#555555' />
        </span>
        <span className='mr3'>{stargazerCount}</span>
      </span>

      <span className="flex items-center">
        <span className='pr1'>
          <WarningIcon width='1em' height='1em' color='#555555' />
        </span>
        <span className='mr3'>{openIssueCount}</span>
      </span>

      <span className="flex items-center">
        <span className='pr1'>
          <ForkIcon width='1.2em' height='1.2em' color='#555555' />
        </span>
        <span className='mr3'>{forkCount}</span>
      </span>

      <span className="flex items-center">
        <span className='pr1'>
          <EyeIcon width='1.5em' height='1.5em' color='#555555' />
        </span>
        <span className='mr3'>{watcherCount}</span>
      </span>
    </div>

    {description
      ? <p className='f6 lh-copy'>{description}</p>
      : <p className='f6 lh-copy gray'>(No description provided)</p>}

    <style jsx>{`
      ._wrapper:hover {
        margin-left: -1px;
        border-color: #357edd;
        border-width: 3px;
      }
    `}</style>
  </div>
/* eslint-enable camelcase */

Repo.propTypes = {
  name: PropTypes.string.isRequired,
  nameWithOwner: PropTypes.string.isRequired,
  githubUrl: PropTypes.string.isRequired,
  description: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  forkCount: PropTypes.number.isRequired,
  stargazerCount: PropTypes.number.isRequired,
  openIssueCount: PropTypes.number.isRequired,
  watcherCount: PropTypes.number.isRequired,
  ownerUsername: PropTypes.string.isRequired,
  ownerGithubUrl: PropTypes.string.isRequired,
}

export default Repo
