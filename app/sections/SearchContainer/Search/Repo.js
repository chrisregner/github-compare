import React from 'react'
import c from 'classnames'
import PropTypes from 'prop-types'
import format from 'date-fns/format'
import CalendarIcon from 'app/components/icons/CalendarIcon'
import EyeIcon from 'app/components/icons/EyeIcon'
import ForkIcon from 'app/components/icons/ForkIcon'
import LinkIcon from 'app/components/icons/LinkIcon'
import PencilIcon from 'app/components/icons/PencilIcon'
import StarIcon from 'app/components/icons/StarIcon'
import UserIcon from 'app/components/icons/UserIcon'
import WarningIcon from 'app/components/icons/WarningIcon'

const Repo = ({
  createdAt,
  description,
  forkCount,
  githubUrl,
  isAdded,
  name,
  nameWithOwner,
  openIssueCount,
  ownerGithubUrl,
  ownerUsername,
  stargazerCount,
  toggleCandidate,
  updatedAt,
  watcherCount,
}) =>
  <div className='_wrapper flex bl bw1 b--light-silver'>
    <div className='_details-wrapper pa3'>
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
    </div>

    <button onClick={toggleCandidate} className={c('bn br2 w2 f6', isAdded ? 'bg-blue' : 'bg-gray')}>
      {isAdded ? '-' : '+'}
    </button>

    <style jsx>{`
      ._details-wrapper { flex: 1; }
      ._wrapper:hover {
        margin-left: -1px;
        border-color: #357edd;
        border-width: 3px;
      }
    `}</style>
  </div>

Repo.propTypes = {
  createdAt: PropTypes.string.isRequired,
  description: PropTypes.string,
  forkCount: PropTypes.number.isRequired,
  githubUrl: PropTypes.string.isRequired,
  isAdded: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  nameWithOwner: PropTypes.string.isRequired,
  openIssueCount: PropTypes.number.isRequired,
  ownerGithubUrl: PropTypes.string.isRequired,
  ownerUsername: PropTypes.string.isRequired,
  stargazerCount: PropTypes.number.isRequired,
  toggleCandidate: PropTypes.func.isRequired,
  updatedAt: PropTypes.string.isRequired,
  watcherCount: PropTypes.number.isRequired,
}

export default Repo
