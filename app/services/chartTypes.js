import React from 'react'
import BarChart from './chartTypes/BarChart'
import PieChart from './chartTypes/PieChart'
import BarChartIcon from 'app/components/icons/BarChartIcon'
import PieChartIcon from 'app/components/icons/PieChartIcon'
import TimeChartIcon from 'app/components/icons/TimeChartIcon'
import EyeIcon from 'app/components/icons/EyeIcon'
import ForkIcon from 'app/components/icons/ForkIcon'
import StarIcon from 'app/components/icons/StarIcon'
import WarningIcon from 'app/components/icons/WarningIcon'
import CakeIcon from 'app/components/icons/CakeIcon'
import PullIcon from 'app/components/icons/PullIcon'

const BASE_URL = '/compare'
const CHART_TYPES = [
  {
    key: 'bar',
    title: 'Bar Charts',
    component: BarChart,
    icon: BarChartIcon,
    types: [
      {
        title: 'Stars',
        key: 'stargazerCount',
        icon: StarIcon,
      },
      {
        title: 'Forks',
        key: 'forkCount',
        icon: ForkIcon,
      },
      {
        title: 'Open Issues',
        key: 'openIssueCount',
        icon: WarningIcon,
      },
      {
        title: 'Watchers',
        key: 'watcherCount',
        icon: EyeIcon,
      },
    ],
  },
  {
    key: 'pie',
    title: 'Pie Charts',
    component: PieChart,
    icon: PieChartIcon,
    types: [
      {
        key: 'issues',
        title: 'Issues',
        icon: WarningIcon,
        valueKeys: [
          { key: 'closedIssueCount', title: 'Closed' },
          { key: 'openIssueCount', title: 'Open' },
        ],
      },
      {
        key: 'pullReqs',
        title: 'Pull Requests',
        icon: PullIcon,
        valueKeys: [
          { key: 'mergedPullReqCount', title: 'Merged' },
          { key: 'closedPullReqCount', title: 'Closed' },
          { key: 'openPullReqCount', title: 'Open' },
        ],
      },
    ],
  },
  {
    key: 'timeline',
    title: 'Timeline Charts',
    icon: TimeChartIcon,
    component: () => <span className='gray'>Sorry, timeline chart is still a work in progress.</span>,
    types: [
      {
        title: 'Age (Create/Update)',
        key: 'age',
        icon: CakeIcon,
        valueKeys: [
          { key: 'createdAt', title: 'Created At' },
          { key: 'updatedAt', title: 'Updated At' },
        ],
      },
    ],
  },
]

const chartTypes = {
  getLinks: () =>
    CHART_TYPES.map(type =>
      ({
        to: `${BASE_URL}/${type.key}`,
        title: type.title,
        icon: type.icon,
        children: type.types.map(subtype =>
          ({
            to: `${BASE_URL}/${type.key}/${subtype.key}`,
            title: subtype.title,
            icon: subtype.icon,
          })),
      })),
  getSlugs: () =>
    [{
      slug: 'compare',
      children: CHART_TYPES.map(type =>
        ({
          slug: type.key,
          children: type.types.map(subtype =>
            ({ slug: subtype.key })),
        })),
    }],
  addUrlDefault: (url) => {
    const segs = removeOuterSlashes(url).split('/')
    const slugs = chartTypes.getSlugs()

    return segs.length ? fillEmptyChildSlugs(url, slugs) : url
  },
  getDefaultCat: () => CHART_TYPES[0],
  getDefaultType: catKey => CHART_TYPES.find(cat => cat.key === catKey).types[0],
  getCatByKey: (key) => {
    for (const cat of CHART_TYPES)
      if (cat.key === key)
        return cat
  },
  getTypeByKey: (key) => {
    for (const cat of CHART_TYPES)
      for (const type of cat.types)
        if (type.key === key)
          return type
  },
}

/* Internal Functions */

const removeOuterSlashes = str => str.replace(/^\/|\/$/g, '')

const fillEmptyChildSlugs = (url, slugs, slugDepth = 0, urlSegms) => {
  if (!urlSegms)
    urlSegms = removeOuterSlashes(url).split('/')

  const match = slugs.find(slug => slug.slug === urlSegms[slugDepth])

  if (match && match.children && match.children.length)

    // If there is a matching slug with children but url has none, create the default url
    if (!urlSegms[slugDepth + 1])
      return nestUrlWithChildSlugs(url, match.children)

    // If there is a matching slug with children and url has it, check deeper for empty child slugs
    else
      return fillEmptyChildSlugs(url, match.children, slugDepth + 1, urlSegms)

  // If there's no matching slug with children, return the url as is
  else
    return url
}

const nestUrlWithChildSlugs = (url, children) => {
  const firstChildSlug = children && children[0]

  return firstChildSlug
    ? nestUrlWithChildSlugs(`${url}/${firstChildSlug.slug}`, firstChildSlug.children)
    : url
}

export default chartTypes
