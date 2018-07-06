/* eslint-disable react/no-unused-prop-types */

import React from 'react'
import { withFauxDOM } from 'react-faux-dom'
import PropTypes from 'prop-types'
import d3 from 'app/services/d3'
import withContainerWidth from 'app/utils/withContainerWidth'
import withStyleableContainer from 'app/utils/withStyleableContainer'
import lighten from 'app/utils/lighten'
import { compose, lifecycle } from 'recompose'

const HEIGHT = 400
const HIGHLIGHT_SIZE = 3
const MARGIN = { top: 25, bottom: 15, left: 50, right: 0 }

const BarChart = ({
  chart,
  propName,
}) =>
  <div>
    <h2 className='mb3 f3 tc'>{propName} Count</h2>
    {chart}
  </div>

const withLifecycle = lifecycle({
  componentDidMount: function () {
    renderD3(this.props, this)
    updateHighlight(this.props, this)
    // this.props.drawFauxDOM()
  },

  componentDidUpdate: function (prevProps) {
    // TODO: handle width changes

    if (prevProps.candidates !== this.props.candidates) {
      updateCandidates(this.props, this)
      updateHighlight(this.props, this)
      this.props.drawFauxDOM()
    } else if (prevProps.inspectedCandidateId !== this.props.inspectedCandidateId) {
      updateHighlight(this.props, this)
      this.props.drawFauxDOM()
    }
  },
})

const renderD3 = ({
  candidates,
  connectFauxDOM,
  inspectedCandidateId,
  width,
}, that) => {
  const innerWd = width - (MARGIN.left + MARGIN.right)
  const innerHt = HEIGHT - (MARGIN.top + MARGIN.bottom)
  const highestValue = candidates.reduce((acc, c) =>
    Math.max(acc, c.value), 0)
  const x = d3.scaleBand()
    .domain(candidates.map(c => c.id))
    .rangeRound([0, innerWd])
  const y = d3.scaleLinear()
    .domain([0, highestValue])
    .rangeRound([innerHt, 0])
  const svg = connectFauxDOM('svg', 'chart')
  const barWd = (innerWd / 10) * 0.80

  // Save stuffs that will be used by other functions
  that.innerWd = innerWd
  that.innerHt = innerHt
  that.x = x
  that.y = y
  that.barWd = barWd

  // Setup SVG
  svg.style.setProperty('background', '#fafafa')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', HEIGHT)

  // Add the main wrapper
  const wrapperSel = d3.select(svg)
    .append('g')
    .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')')

  // Add y axis
  wrapperSel.append('g')
    .attr('class', 'axis-y')
    .call(d3.axisLeft(y))

  // Add candidate groups
  const candidatesSel = wrapperSel.append('g')
    .selectAll('g')
    .data(candidates)
    .enter()
    .append('g')
    .attr('class', 'candidate')
    .on('click', d => d.toggleClickInspect())
    .on('mouseover', d => d.toggleHoverInspect())
    .on('mouseout', d => d.toggleHoverInspect())

  // Add the candidate bars
  candidatesSel.append('rect')
    .attr('class', 'bar')
    .attr('width', barWd)
    .attr('height', d => innerHt - y(d.value))
    .attr('x', d => x(d.id) + (x.bandwidth() / 2) - (barWd / 2))
    .attr('y', d => y(d.value))
    .attr('fill', d => d.color)

  // Add the candidate tooltip
  candidatesSel.append('title')
    .text(d => `${d.id} (click to inspect)`)

  // Add the candidate text (the value above the bar)
  candidatesSel.append('text')
    .text(d => d.value)
    .attr('class', 'f7')
    .attr('text-anchor', 'middle')
    .attr('x', d => x(d.id) + (x.bandwidth() / 2))
    .attr('y', d => y(d.value) - 5)
}

const updateHighlight = ({
  connectFauxDOM,
  inspectedCandidateId,
  drawFauxDOM,
}, that) => {
  const candidatesSel = d3.select(connectFauxDOM('svg', 'chart'))
    .selectAll('.candidate')

  // Update text highligh styles
  candidatesSel.selectAll('text')
    .attr('fill', d =>
      (d.id === inspectedCandidateId) ? '#333' : '#888')
    .style('font-weight', d =>
      (d.id === inspectedCandidateId) ? 'bold' : 'normal')

  // Remove any highlight rects for unhighlighted candidates
  candidatesSel.filter(d => d.id !== inspectedCandidateId)
    .selectAll('.highlight')
    .remove()

  const innerHt = that.innerHt
  const barWd = that.barWd
  const x = that.x
  const y = that.y
  const candToHighlight = candidatesSel.filter(d => d.id === inspectedCandidateId)

  // if highlighted candidate don't have it yet, add the highlight rect
  if (candToHighlight.selectAll('.highlight').empty())
    candToHighlight
      .append('rect')
      .attr('class', 'highlight')
      .attr('fill', 'none')
      .attr('width', barWd + (HIGHLIGHT_SIZE))
      .attr('height', d => innerHt - y(d.value) + (HIGHLIGHT_SIZE))
      .attr('x', d => x(d.id) + (x.bandwidth() / 2) - (barWd / 2) - HIGHLIGHT_SIZE / 2)
      .attr('y', d => y(d.value) - HIGHLIGHT_SIZE / 2)
      .attr('stroke-width', HIGHLIGHT_SIZE)
      .attr('rx', HIGHLIGHT_SIZE)
      .attr('ry', HIGHLIGHT_SIZE)
      .attr('stroke', d => lighten(d.color))
}

const updateCandidates = ({
  candidates,
  connectFauxDOM,
  inspectedCandidateId,
  width,
}, that) => {
  const innerWd = that.innerWd
  const innerHt = that.innerHt
  const barWd = that.barWd
  const highestValue = candidates.reduce((acc, c) =>
    Math.max(acc, c.value), 0)
  const x = d3.scaleBand()
    .domain(candidates.map(c => c.id))
    .rangeRound([0, innerWd])
  const y = d3.scaleLinear()
    .domain([0, highestValue])
    .rangeRound([innerHt, 0])
  const svgSel = d3.select(connectFauxDOM('svg', 'chart'))

  // Save stuffs that will be used by other functions
  that.x = x
  that.y = y

  // Update new y axis
  svgSel.select('.axis-y')
    .call(d3.axisLeft(y))

  // Update the candidate data
  const candidatesSel = svgSel.selectAll('.candidate')
    .data(candidates)

  // Update the candidate bars
  candidatesSel.select('.bar')
    .attr('x', d => x(d.id) + (x.bandwidth() / 2) - (barWd / 2))
    .attr('y', d => y(d.value))
    .attr('fill', d => d.color)
    .attr('width', barWd)
    .attr('height', d => innerHt - y(d.value))

  // Update the candidate text (the value above the bar)
  candidatesSel.select('text')
    .text(d => d.value)
    .attr('class', 'f7')
    .attr('text-anchor', 'middle')
    .attr('x', d => x(d.id) + (x.bandwidth() / 2))
    .attr('y', d => y(d.value) - 5)
}

BarChart.propTypes = {
  candidates: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    toggleClickInspect: PropTypes.func.isRequired,
    toggleHoverInspect: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired,
  })).isRequired,
  chart: PropTypes.node,
  connectFauxDOM: PropTypes.func.isRequired,
  drawFauxDOM: PropTypes.func.isRequired,
  inspectedCandidateId: PropTypes.string,
  propName: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
}

export default compose(
  withStyleableContainer,
  withContainerWidth,
  withFauxDOM,
  withLifecycle,
)(BarChart)
