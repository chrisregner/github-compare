/* eslint-disable react/no-unused-prop-types */

import React from 'react'
import { withFauxDOM } from 'react-faux-dom'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import withContainerWidth from 'app/utils/withContainerWidth'
import withStyleableContainer from 'app/utils/withStyleableContainer'
import lighten from 'app/utils/lighten'
import { compose, lifecycle } from 'recompose'

const HEIGHT = 400
const MARGIN = { top: 25, bottom: 10, left: 50, right: 0 }
const BAR_PADDING = 0.3
const HIGHLIGHT_SIZE = 5
const DURATION = 500

const drawChart = (inst) => {
  const {
    animateFauxDOM,
    candidates,
    connectFauxDOM,
    width,
  } = inst.props

  const innerWd = width - (MARGIN.left + MARGIN.right)
  const innerHt = inst.innerHt || (HEIGHT - (MARGIN.top + MARGIN.bottom))
  const highestValue = candidates.reduce((acc, c) =>
    Math.max(acc, c.value), 0)
  const x = d3.scaleBand()
    .domain(candidates.map(c => c.id))
    .rangeRound([0, innerWd])
  const y = d3.scaleLinear()
    .domain([0, highestValue])
    .rangeRound([innerHt, 0])
  const svg = connectFauxDOM('svg', 'chart')
  const barWd = (innerWd / 10) * (1 - BAR_PADDING)
  let t, axisYSel, candidatesSel, barsTrans, titlesSel, valuesSel

  // If this is first render...
  if (!inst.hasRendered) {
    // Setup SVG
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', HEIGHT)

    // Add the main wrapper
    const wrapperSel = d3.select(svg)
      .append('g')
      .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')')

    // Add y axis element
    axisYSel = wrapperSel.append('g')
      .attr('class', 'axis-y')

    // Add candidate groups element; enter data
    candidatesSel = wrapperSel.append('g')
      .selectAll('g')
      .data(candidates)
      .enter()
      .append('g')
      .attr('class', 'candidate')
      .on('click', d => d.toggleClickInspect())
      .on('mouseenter', d => d.toggleHoverInspect())
      .on('mouseleave', d => d.toggleHoverInspect())

    // Create transition instance
    t = candidatesSel.transition()
      .duration(DURATION)
      .on('end', () => {
        delete inst.t
        inst.updateHighlight()
      })

    // Add the bar elements; set properties unique to first render; get its transition instance
    barsTrans = candidatesSel.append('rect')
      .attr('class', 'bar')
      .attr('width', barWd)
      .attr('height', 0)
      .attr('x', d => x(d.id) + (x.bandwidth() / 2) - (barWd / 2))
      .attr('y', innerHt)
      .attr('fill', d => d.color)
      .transition(t)

    // Add the tooltip elements
    titlesSel = candidatesSel.append('title')

    // Add the values elements
    valuesSel = candidatesSel.append('text')
      .style('font-size', '.75em')
      .attr('fill', '#888')
      .attr('alignment-baseline', 'baseline')
      .attr('text-anchor', 'middle')
      .attr('x', d => x(d.id) + (x.bandwidth() / 2))
      .attr('y', innerHt - 15)

    // Flag the first render for future reference
    inst.hasRendered = true

  // Else, if this is an update rather than first render...
  } else {
    // Remove highlights
    removeHighlight(inst, true)

    // Select elements; enter candidates data
    axisYSel = d3.select(svg).select('.axis-y')
    candidatesSel = d3.select(svg)
      .selectAll('.candidate')
      .data(candidates) // data should be updated before selecting its descendants
    titlesSel = candidatesSel.select('title')
    valuesSel = candidatesSel.select('text')

    // Get bar transition instance
    barsTrans = candidatesSel.select('.bar').transition(t)

    // Create transition instance
    t = candidatesSel.transition()
      .duration(DURATION)
      .on('end', () => {
        delete inst.t
        inst.updateHighlight()
      })

    // Get bars transition instance; do updates/animations that are unique to update scenario
    barsTrans = candidatesSel.select('.bar')
      .transition(t)
      .attr('fill', d => d.color)
      .attr('width', barWd)
  }

  // Update y axis
  axisYSel.call(d3.axisLeft(y))

  // Do bars updates/animations that are common to both first render and update scenario
  barsTrans
    .attr('height', d => innerHt - y(d.value))
    .attr('y', d => y(d.value))

  // Update the candidate tooltip
  titlesSel.text(d => `${d.id} (click to inspect)`)

  // Update/animate the values
  valuesSel
    .text(d => d.value)
    .transition(t)
    .attr('y', d => y(d.value) - 5)

  // Save stuffs that will be used by other functions
  inst.innerHt = innerHt
  inst.x = x
  inst.y = y
  inst.barWd = barWd
  inst.t = t

  // Animate changes to React
  animateFauxDOM(1000)
}

const updateHighlight = (inst) => {
  const {
    connectFauxDOM,
    animateFauxDOM,
    inspectedCandidateId,
  } = inst.props

  // Remove highlight of any candidate that shouldn't be highlighted
  removeHighlight(inst)

  // Highlight the inspected candidate (if not highlighted yet)
  const toHighlightSel = d3.select(connectFauxDOM('svg', 'chart'))
    .selectAll('.candidate:not(.candidate--highlighted)')
    .filter(d => d.id === inspectedCandidateId)

  if (toHighlightSel.size()) {
    const innerHt = inst.innerHt
    const barWd = inst.barWd
    const x = inst.x
    const y = inst.y

    toHighlightSel
      .classed('candidate--highlighted', true)

    toHighlightSel.insert('rect', ':first-child')
      .attr('class', 'highlight')
      .attr('fill', d => lighten(0.125, d.color))
      .attr('rx', HIGHLIGHT_SIZE)
      .attr('ry', HIGHLIGHT_SIZE)
      .attr('height', d => innerHt - y(d.value))
      .attr('width', barWd)
      .attr('x', d => x(d.id) + (x.bandwidth() / 2) - (barWd / 2))
      .attr('y', d => y(d.value))
      .transition()
      .duration(DURATION)
      .attr('height', d => innerHt - y(d.value) + (HIGHLIGHT_SIZE * 2))
      .attr('width', barWd + (HIGHLIGHT_SIZE * 2))
      .attr('x', d => x(d.id) + (x.bandwidth() / 2) - (barWd / 2) - HIGHLIGHT_SIZE)
      .attr('y', d => y(d.value) - HIGHLIGHT_SIZE)

    toHighlightSel.select('text')
      .transition()
      .duration(DURATION)
      .attr('fill', '#333')
      .attr('y', d => y(d.value) - 10)
      .style('font-weight', '700')
      .style('font-size', '.9em')
  }

  animateFauxDOM(DURATION)
}

const removeHighlight = (inst, shouldRemoveAll) => {
  const {
    connectFauxDOM,
    inspectedCandidateId,
  } = inst.props

  const toUnhighlightSel = d3.select(connectFauxDOM('svg', 'chart'))
    .selectAll('.candidate--highlighted')
    .call(sel =>
      shouldRemoveAll
        ? sel
        : sel.filter(d => d.id !== inspectedCandidateId))

  if (toUnhighlightSel.size()) {
    toUnhighlightSel
      .classed('candidate--highlighted', false)

    toUnhighlightSel
      .select('.highlight')
      .remove()

    toUnhighlightSel
      .select('text')
      .interrupt()
      .style('font-weight', '500')
      .style('font-size', '.75em')
      .attr('fill', '#888')
      .attr('y', d => inst.y(d.value) - 5)
  }
}

const BarChart = ({
  chart,
  dataKeyName,
}) =>
  <div>
    <h2 className='mb3 f3 tc'>{dataKeyName} Count</h2>
    {chart}
  </div>

BarChart.propTypes = {
  animateFauxDOM: PropTypes.func.isRequired,
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
  dataKeyName: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
}

export default compose(
  withStyleableContainer,
  withContainerWidth,
  withFauxDOM,

  lifecycle({
    componentDidMount: function () {
      drawChart(this)
      this.updateHighlight = () => updateHighlight(this)
    },

    componentDidUpdate: function (prevProps) {
      // TODO: handle width changes

      // If candidates has changed...
      if (prevProps.candidates !== this.props.candidates)
        drawChart(this)

      // Else, if inspected candidate has changed and the chart is NOT animating
      // (highlight would be automatically updated every time an animation finishes)
      else if ((prevProps.inspectedCandidateId !== this.props.inspectedCandidateId) && !this.t)
        this.updateHighlight()
    },
  }),
)(BarChart)
