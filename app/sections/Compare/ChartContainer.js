import { compose, withProps } from 'recompose'
import { connect } from 'react-redux'
import { getCandidates } from 'app/state/candidates'
import { getInspectedId, toggleClickInspect, toggleHoverInspect } from 'app/state/ui'
import chartTypes from 'app/services/chartTypes'
import React from 'react'
import withStyleableContainer from 'app/utils/withStyleableContainer'
import * as R from 'ramda'

export default compose(
  withStyleableContainer,

  connect(
    (state, ownProps) => ({
      candidates: getCandidates(state),
      inspectedId: getInspectedId(state),
    }),
    { toggleClickInspect, toggleHoverInspect },
  ),

  withProps(({ match, candidates, toggleClickInspect, toggleHoverInspect }) => {
    const cat = match.params.cat
      ? chartTypes.getCatByKey(match.params.cat)
      : chartTypes.getDefaultCat()
    const type = match.params.type
      ? chartTypes.getTypeByKey(match.params.type)
      : chartTypes.getDefaultType(cat.key)

    return {
      candidates: cachedMapCandidates(candidates, type, toggleClickInspect, toggleHoverInspect),
      Component: cat.component,
      typeTitle: type.title,
    }
  })
)(({ Component, ...props }) => <Component {...props} />)

/*
 * Memoize candidate mapping to avoid unnecessary redraw on update. An example of unnecessary
 * redraw is when highlighting a bar in BarGraph, which redraws if strict equality test between
 * prev and new candidates fails. (NOTE: strict equality tests object references rather than its
 * properties which is expensive)
 */
const cachedMapCandidates = R.memoizeWith(
  (candidates, type) => JSON.stringify(candidates) + type.key,
  (candidates, type, toggleClickInspect, toggleHoverInspect) =>
    candidates.map((cand, i) => ({
      id: cand.nameWithOwner,
      value: type.valueKeys
        ? type.valueKeys.map(keyInfo =>
          ({ value: cand[keyInfo.key], title: keyInfo.title }))
        : cand[type.key],
      color: cand.color,
      toggleClickInspect: () => toggleClickInspect(cand.nameWithOwner),
      toggleHoverInspect: () => toggleHoverInspect(cand.nameWithOwner),
    }))
      .sort((a, b) => a.value < b.value))
