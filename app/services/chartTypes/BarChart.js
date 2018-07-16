/* eslint-disable react/no-unused-prop-types */

import { compose, lifecycle, withState } from 'recompose'
import { lighten } from 'app/services/colors'
import { withDebouncedWidth } from 'app/utils/withContainerWidth'
import * as d3 from 'd3'
import PropTypes from 'prop-types'
import React from 'react'
import ReactLoading from 'react-loading'

const HEIGHT = 400
const MARGIN = { top: 25, bottom: 10, left: 40, right: 0 }
const BAR_PADDING_PCT = 0.25
const DURATION = 500

const BarChart = ({
  chart,
  Icon,
  isLoading,
  typeTitle,
  setSvgRef,
}) =>
  <React.Fragment>
    <h2 className='mb4 f3'>
      <span className='mr2'>
        <Icon svgProps={{ width: '.75em', height: '.75em' }} pathProps={{ fill: '#333' }} />
      </span>
      {typeTitle} Count
    </h2>
    {isLoading && <ReactLoading className='mv6 center db' type='spin' color='#333333' />}
    {<svg className={isLoading ? 'dn' : ''} ref={setSvgRef} />}
    <style jsx global>{`
      .axis-y-grid line {
        stroke: #e6e6e6;
        stroke-dasharray: 2;
      }

      .axis-y-grid path {
        stroke-width: 0;
      }
    `}</style>
  </React.Fragment>

BarChart.propTypes = {
  candidates: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    toggleClickInspect: PropTypes.func.isRequired,
    toggleHoverInspect: PropTypes.func.isRequired,
    unhoverInspect: PropTypes.func.isRequired,
    value: PropTypes.number.isRequired,
  })).isRequired,
  chart: PropTypes.node,
  Icon: PropTypes.func.isRequired,
  inspectedId: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  setSvgRef: PropTypes.func.isRequired,
  svgRef: PropTypes.object,
  typeTitle: PropTypes.string.isRequired,
  width: PropTypes.number,
}

const enhance = compose(
  withDebouncedWidth,
  withState('svgRef', 'setSvgRef', null),

  lifecycle({
    componentDidUpdate: function (prevProps) {
      if (!this.props.isLoading)
        if (this.props.isLoading !== prevProps.isLoading)
          drawChart(this, true)
        else if (prevProps.candidates !== this.props.candidates)
          drawChart(this)
        else if ((prevProps.inspectedId !== this.props.inspectedId) && !this.t)
          updateInspected(this)
    },
  }),
)

/* Internal Functions */

const drawChart = (inst, shouldDrawFromScratch) => {
  const {
    candidates,
    width,
    svgRef,
  } = inst.props

  const innerWd = width - (MARGIN.left + MARGIN.right)
  const innerHt = inst.innerHt || (HEIGHT - (MARGIN.top + MARGIN.bottom))
  const highestValue = candidates.reduce((acc, c) =>
    Math.max(acc, c.value), 0)
  const x = d3.scaleBand()
    .domain(candidates.map(c => c.id))
    .rangeRound([0, innerWd])
    .padding(
      calcPdPct({
        qty: candidates.length,
        pdPct: BAR_PADDING_PCT,
        maxQty: 10,
      })
    )
  const y = d3.scaleLinear()
    .domain([0, highestValue])
    .rangeRound([innerHt, 0])

  let t, axisYLabelSel, axisYGridSel, candidatesSel, barsTrans, valuesSel

  // If this is first render...
  if (shouldDrawFromScratch) {
    // Setup SVG
    svgRef.innerHTML = '' // Remove any previous chart
    svgRef.setAttribute('width', '100%')
    svgRef.setAttribute('height', HEIGHT)

    // Add the main wrapper
    const wrapperSel = d3.select(svgRef)
      .append('g')
      .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`)

    // Add y axis element
    axisYGridSel = wrapperSel.append('g')
      .attr('class', 'axis-y-grid')
    axisYLabelSel = wrapperSel.append('g')
      .attr('class', 'axis-y-label')

    // Add candidate groups element; enter data
    candidatesSel = wrapperSel.append('g')
      .selectAll('g')
      .data(candidates)
      .enter()
      .append('g')
      .attr('class', 'candidate')
      .on('click', d => d.toggleClickInspect())
      .on('mouseenter', d => d.toggleHoverInspect())
      .on('mouseleave', d => d.unhoverInspect())

    // Create transition instance
    t = candidatesSel.transition()
      .duration(DURATION)
      .on('end', () => {
        inst.tEndCount++

        if (inst.tEndCount === candidates.length) {
          delete inst.t
          updateInspected(inst)
        }
      })

    inst.t = t
    inst.tEndCount = 0

    // Add the bar elements; set properties unique to first render; get its transition instance
    barsTrans = candidatesSel.append('rect')
      .attr('class', 'bar')
      .attr('cursor', 'pointer')
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('x', d => x(d.id))
      .attr('y', innerHt)
      .attr('fill', d => d.color)
      .transition(t)

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
    const svgSel = d3.select(svgRef)
    axisYLabelSel = svgSel.select('.axis-y-label')
    axisYGridSel = svgSel.select('.axis-y-grid')
    candidatesSel = svgSel.selectAll('.candidate')
      .data(candidates) // data should be updated before selecting its descendants
    valuesSel = candidatesSel.select('text')

    // Create transition instance
    t = candidatesSel.transition()
      .duration(DURATION)
      .on('end', () => {
        delete inst.t
        updateInspected(inst)
      })

    // Get bars transition instance; do updates/animations that are unique to update scenario
    barsTrans = candidatesSel.select('.bar')
      .transition(t)
      .attr('fill', d => d.color)
      .attr('width', x.bandwidth())
  }

  // Update y axis
  axisYGridSel
    .call(
      d3.axisLeft(y)
        .tickSize(-innerWd + 6)
        .tickFormat(''))

  axisYLabelSel
    .call(d3.axisLeft(y))

  // Do bars updates/animations that are common to both first render and update scenario
  barsTrans
    .attr('height', d => innerHt - y(d.value))
    .attr('y', d => y(d.value))

  // Update/animate the values
  valuesSel
    .text(d => d.value)
    .transition(t)
    .attr('y', d => y(d.value) - 5)

  // Save stuffs that will be used by other functions
  inst.innerHt = innerHt
  inst.x = x
  inst.y = y
}

const updateInspected = (inst) => {
  const {
    inspectedId,
    width,
    svgRef,
  } = inst.props

  const highlightSize = width >= 600 ? 5 : 3

  // Remove highlight of any candidate that shouldn't be highlighted
  removeHighlight(inst)

  // Highlight the inspected candidate (if not highlighted yet)
  const toHighlightSel = d3.select(svgRef)
    .selectAll('.candidate:not(.candidate--highlighted)')
    .filter(d => d.id === inspectedId)

  if (toHighlightSel.size()) {
    const innerHt = inst.innerHt
    const x = inst.x
    const y = inst.y

    toHighlightSel
      .classed('candidate--highlighted', true)

    toHighlightSel.insert('rect', ':first-child')
      .attr('class', 'highlight')
      .attr('fill', d => lighten(d.color))
      .attr('rx', highlightSize)
      .attr('ry', highlightSize)
      .attr('height', d => innerHt - y(d.value))
      .attr('width', x.bandwidth())
      .attr('x', d => x(d.id))
      .attr('y', d => y(d.value))
      .transition()
      .duration(DURATION)
      .attr('height', d => innerHt - y(d.value) + (highlightSize * 2))
      .attr('width', x.bandwidth() + (highlightSize * 2))
      .attr('x', d => x(d.id) - highlightSize)
      .attr('y', d => y(d.value) - highlightSize)

    toHighlightSel.select('text')
      .transition()
      .duration(DURATION)
      .attr('fill', '#333')
      .attr('y', d => y(d.value) - 10)
      .style('font-weight', '700')
      .style('font-size', '.9em')
  }
}

const removeHighlight = (inst, shouldRemoveAll) => {
  const {
    inspectedId,
    svgRef,
  } = inst.props

  const toUnhighlightSel = d3.select(svgRef)
    .selectAll('.candidate--highlighted')
    .call(sel =>
      shouldRemoveAll
        ? sel
        : sel.filter(d => d.id !== inspectedId))

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

const calcPdPct = ({ qty, pdPct, maxQty }) => {
  const sampleWd = 102.5
  const colPct = 1 - pdPct
  const sampleColWdGross = (sampleWd / (maxQty + pdPct))
  const idealNetWd = sampleColWdGross * colPct
  const totalPd = sampleWd - (qty * idealNetWd)
  const pd = totalPd / (qty + 1)
  const pdPctForQty = pd / (idealNetWd + pd)
  return pdPctForQty
}

export default enhance(BarChart)
