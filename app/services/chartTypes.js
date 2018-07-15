import React from 'react'
import BarChart from './chartTypes/BarChart'
import PieChart from './chartTypes/PieChart'

const BASE_URL = '/compare'
const CHART_TYPES = [
  {
    key: 'bar',
    title: 'Bar Charts',
    component: BarChart,
    types: [
      { title: 'Stars', key: 'stargazerCount' },
      { title: 'Forks', key: 'forkCount' },
      { title: 'Open Issues', key: 'openIssueCount' },
      { title: 'Watchers', key: 'watcherCount' },
    ],
  },
  {
    key: 'pie',
    title: 'Pie Charts',
    component: PieChart,
    types: [
      {
        key: 'issues',
        title: 'Issues',
        valueKeys: [
          { key: 'closedIssueCount', title: 'Closed' },
          { key: 'openIssueCount', title: 'Open' },
        ],
      },
      {
        key: 'pullReqs',
        title: 'Pull Requests',
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
    component: () => <span className='gray'>Sorry, timeline chart is still a work in progress.</span>,
    types: [
      {
        title: 'Age (Create/Update)',
        key: 'age',
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
        children: type.types.map(subtype =>
          ({
            to: `${BASE_URL}/${type.key}/${subtype.key}`,
            title: subtype.title,
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
