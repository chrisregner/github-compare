import React from 'react'
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
  description,
  githubUrl,
  name,
  nameWithOwner,
  ownerGithubUrl,
  ownerUsername,
  ...props
}) =>
  <React.Fragment>
    <div className='flex flex-wrap items-center mb2'>
      <h2 className='pr3 f4 normal lh-title'>{name}</h2>

      <span className='flex items-center'>
        <span className='mr1' title='URL'>
          <LinkIcon width='.75em' height='.75em' color='#555555' />
        </span>
        <span className='dib f6'>
          <a href={githubUrl} className='blue no-underline'>{nameWithOwner}</a>
        </span>
      </span>
    </div>

    <div className='flex flex-wrap items-center mb2 f7 gray'>
      <span className='flex items-center' title='author'>
        <span className='mr1'>
          <UserIcon width='1em' height='1em' color='#555555' />
        </span>
        <a href={ownerGithubUrl} className='mr3 blue no-underline'>{ownerUsername}</a>
      </span>

      {repoProps.map(({
        formatter = d => d,
        icon: Icon,
        iconProps = { width: '1em', height: '1em' },
        key,
        tooltip,
      }) =>
        <span className='flex items-center' title={tooltip} key={key}>
          <span className='mr1'>
            <Icon {...iconProps} color='#555555' />
          </span>
          <span className='mr3'>{formatter(props[key])}</span>
        </span>
      )}
    </div>

    {description
      ? <p className='f6 lh-copy'>{description}</p>
      : <p className='f6 lh-copy gray'>(No description provided)</p>}
  </React.Fragment>

const repoProps = [
  {
    icon: CalendarIcon,
    key: 'createdAt',
    tooltip: 'created at',
    formatter: d => format(new Date(d), 'MM/DD/YY'),
  },
  {
    icon: PencilIcon,
    key: 'updatedAt',
    tooltip: 'updated at',
    formatter: d => format(new Date(d), 'MM/DD/YY'),
  },
  {
    icon: StarIcon,
    key: 'stargazerCount',
    tooltip: 'stars',
    iconProps: { width: '1.2em', height: '1.2em' },
  },
  {
    icon: WarningIcon,
    key: 'openIssueCount',
    tooltip: 'open issues',
  },
  {
    icon: ForkIcon,
    key: 'forkCount',
    tooltip: 'forks',
    iconProps: { width: '1.2em', height: '1.2em' },
  },
  {
    icon: EyeIcon,
    key: 'watcherCount',
    tooltip: 'watchers',
  },
]

Repo.propTypes = {
  createdAt: PropTypes.string.isRequired,
  description: PropTypes.string,
  forkCount: PropTypes.number.isRequired,
  githubUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  nameWithOwner: PropTypes.string.isRequired,
  openIssueCount: PropTypes.number.isRequired,
  ownerGithubUrl: PropTypes.string.isRequired,
  ownerUsername: PropTypes.string.isRequired,
  stargazerCount: PropTypes.number.isRequired,
  updatedAt: PropTypes.string.isRequired,
  watcherCount: PropTypes.number.isRequired,
}

export default Repo
