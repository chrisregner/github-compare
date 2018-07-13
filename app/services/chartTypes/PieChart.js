/* eslint-disable react/no-unused-prop-types, indent */

import 'd3-selection-multi'
import { compose, lifecycle, withState } from 'recompose'
import * as d3 from 'd3'
import * as R from 'ramda'
import PropTypes from 'prop-types'
import React from 'react'
import withContainerWidth from 'app/utils/withContainerWidth'
import withStyleableContainer from 'app/utils/withStyleableContainer'

const GROSS_DIAMETER = 400
const DIAMETER = GROSS_DIAMETER * 0.875
const PADDING = (GROSS_DIAMETER - DIAMETER) / 2
const BTN_PADDING = 2
const BG_COLOR = '#333'
const DURATION = 750
const MIDDLE = DIAMETER / 2

const PieChart = ({
  setSvgRef,
  typeTitle,
}) =>
  <div>
    <h2 className='mb4 f3'>{typeTitle} Pie Chart</h2>
    <svg ref={setSvgRef} />
    {/* {chart} */}
  </div>

const enhance = compose(
  withStyleableContainer,
  withContainerWidth,
  withState('svgRef', 'setSvgRef', null),

  lifecycle({
    componentDidUpdate: function (prevProps) {
      if (!this.hasRendered) {
        this.updateInspected = () => updateInspected(this)
        drawChart(this)
        this.hasRendered = true
      } else {
        // If candidates has changed...
        // if (prevProps.candidates !== this.props.candidates)
        //   drawChart(this)

        // Else, if inspected candidate has changed and the chart is NOT animating
        // (inspected would be automatically updated every time an animation finishes)
        /* else */ if (checkInspectUpdated(prevProps, this.props) && !this.isTransitioning)
          this.updateInspected()
      }
    },
  })
)

PieChart.propTypes = {
  candidates: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    toggleClickInspect: PropTypes.func.isRequired,
    toggleHoverInspect: PropTypes.func.isRequired,
    unhoverInspect: PropTypes.func.isRequired,
    value: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })).isRequired,
  })).isRequired,
  inspectedClickId: PropTypes.string,
  inspectedId: PropTypes.string,
  setSvgRef: PropTypes.func.isRequired,
  svgRef: PropTypes.node,
  typeTitle: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
}

export default enhance(PieChart)

/* Internal Functions */
const drawChart = (inst) => {
  const {
    candidates,
    svgRef,
  } = inst.props

  inst.isTransitioning = true

  svgRef.setAttribute('width', '100%')
  svgRef.setAttribute('height', GROSS_DIAMETER)

  let mappedData = {
    name: 'candidates',
    children: candidates.map(({ value, ...cand }) => ({
      name: cand.name,
      values: value.map(val => val.value),
      valueTitles: value.map(val => val.title),
      ...cand,
    })),
  }

  // Add wrapper; translate to take account for padding
  const wrapper = d3.select(svgRef)
    .append('g')
    .attrs({
      class: 'wrapper',
      transform: `translate(${PADDING}, ${PADDING})`,
    })

  // Save transition instance
  const t = wrapper.transition()
    .duration(DURATION)
    .on('end', () => {
      inst.isTransitioning = false
      inst.updateInspected(inst)
    })

  // Apply hierarchy to data
  const rootData = d3.hierarchy(mappedData)
    .sum(d =>
      d.values
        ? d.values.reduce((sum, val) => sum + val, 0)
        : null)
    .sort((a, b) => b.value - a.value)

  // Apply pack layout to data
  const applyPackLayout = d3.pack()
    .size([DIAMETER, DIAMETER])
    .padding(1)
  applyPackLayout(rootData)

  // Add the parent circle
  wrapper.append('circle')
    .style('fill', BG_COLOR)
    .attrs({
      cx: GROSS_DIAMETER / 2,
      cy: GROSS_DIAMETER / 2,
      r: GROSS_DIAMETER / 2,
      transform: `translate(${-PADDING}, ${-PADDING})`,
    })

  // Add the pies
  const piesData = rootData.leaves()
  const pies = wrapper.selectAll('.pie')
    .data(piesData)
    .enter()
    .append('g')
    .attrs({
      class: 'pie',
      cursor: 'pointer',
    })
    .on('click', d => !inst.isTransitioning && d.data.toggleClickInspect())
    .on('mouseenter', d => !inst.isTransitioning && d.data.toggleHoverInspect())
    .on('mouseleave', d => !inst.isTransitioning && d.data.unhoverInspect())

  // Add the slices; animate;
  pies.selectAll('.slice')
    .data(d => circleToSlices(d))
    .enter()
    .append('path')
    .attrs((d, i) => ({
      class: 'slice',
      fill: d.data.color,
      stroke: BG_COLOR,
      transform: `translate(${d.x}, ${d.y})`,
      d: arc.outerRadius(0).innerRadius(0),
    }))
    .transition(t)
    .attrTween('d', appearTween)

  // Add the issues count
  const info = pies.append('g')
    .attr('class', 'info')
  info.append('rect')
    .attrs(({ x, y, value }) => {
      const infoTxtDim = getTextDimension(value, 'ttu sans-serif', { fontSize: '.625rem' })

      return {
        fill: 'black',
        x: x - ((infoTxtDim.width / 2) + BTN_PADDING),
        y: y - ((infoTxtDim.height / 2) + BTN_PADDING) - 1, // - 1 for descender (typography)
        width: infoTxtDim.width + (BTN_PADDING * 2),
        height: infoTxtDim.height + (BTN_PADDING * 2),
        rx: 3,
        ry: 3,
        opacity: '.5',
      }
    })
  info.append('text')
    .style('text-transform', 'uppercase')
    .attrs(({ x, y }) => ({
      x, y,
      'alignment-baseline': 'middle',
      'font-size': '.625rem',
      'text-anchor': 'middle',
      fill: 'white',
    }))
    .text(d => d.value)

  // Add the (hidden) show button
  const showBtnTxtDim = getTextDimension('Show Details', 'ttu sans-serif', { fontSize: '.625rem' })
  const showBtn = pies.append('g')
    .attrs({
      class: 'show-btn',
      opacity: 0,
    })
  showBtn.append('rect')
    .attrs(d => ({
      fill: '#1971c2',
      x: d.x - ((showBtnTxtDim.width / 2) + BTN_PADDING),
      y: d.y - ((showBtnTxtDim.height / 2) + BTN_PADDING) - 1, // -1 is for descender (typography)
      width: showBtnTxtDim.width + (BTN_PADDING * 2),
      height: showBtnTxtDim.height + (BTN_PADDING * 2),
      opacity: '.9',
      rx: 3,
      ry: 3,
    }))
  showBtn.append('text')
    .style('text-transform', 'uppercase')
    .attrs(({ x, y }) => ({
      x, y,
      fill: 'white',
      'alignment-baseline': 'middle',
      'font-size': '.625rem',
      'text-anchor': 'middle',
    }))
    .text('Show Details')
}

const updateInspected = (inst) => {
  const {
    inspectedClickId,
    inspectedId,
    svgRef,
  } = inst.props

  const svg = d3.select(svgRef)
  const pies = svg.selectAll('.pie')
  const hasPreviouslyClicked = svg.selectAll('.pie.clicked').size()

  // Flag if transitioning (to block other update until it finishes)
  if (
    (inspectedClickId && !svg.select('.clicked').size())
    || (!inspectedClickId && svg.select('.clicked').size())
  )
    inst.isTransitioning = true

  // Create transition instance
  const t = svg.transition()
    .duration(DURATION)
    .on('end', () => {
      inst.isTransitioning = false
    })

  // Raise the inspected
  pies.filter(d => d.data.id === inspectedId)
    .raise()

  // Show Button
  pies.select('.show-btn')
    .attr('opacity', d =>
      !inspectedClickId && (d.data.id === inspectedId) // hover inspected but NOT clicked
        ? 1 : 0)

  // Info Button
  const info = pies.select('.info')
  if (inspectedClickId) {
    // Immediately hide the clicked
    info.filter(d => d.data.id === inspectedId)
      .attr('opacity', 0)

    // Fade out those that aren't clicked
    info.filter(d => d.data.id !== inspectedId)
      .transition(t)
      .attr('opacity', 0)
  } else if (hasPreviouslyClicked) {
    info.transition(t)
      .attr('opacity', 1)
  } else {
    info.attr('opacity', 1)
  }

  // Clicked pies (Grow and move to middle)
  pies.filter(d => d.data.id === inspectedClickId)
    .selectAll('.slice')
    .transition(t)
    .attrTween('transform', tweenToMiddle)
    .attrTween('d', tweenGrow)

  // Nonclicked pies (shrink)
  if (inspectedClickId)
    pies.filter(d => d.data.id !== inspectedId)
      .selectAll('.slice')
      .transition(t)
      .attrTween('d', tweenShrink)

  // Unclicked
  svg.selectAll('.pie.clicked')
    .filter(d => d.id !== inspectedClickId).selectAll('.slice')
    .transition(t)
    .attrTween('transform', tweenToOrigPos)
    .attrTween('d', tweenRevertGrow)

  // Undo nonclicked
  if (hasPreviouslyClicked)
    svg.selectAll('.pie:not(.clicked)')
      .filter(d => d.data.id !== inspectedId)
      .selectAll('.slice')
      .transition(t)
      .attrTween('d', appearTween)

  // Apply appropriate classes
  pies.classed('hovered', d => !inspectedClickId && d.data.id === inspectedId)
  pies.classed('clicked', d => d.data.id === inspectedClickId)
}

const arc = d3.arc()
const applyPieLayout = d3.pie()
  .sort(null)
  .value(d => d.value)
const varyRadius = (r, i) =>
  r - (r * 0.125 * i)

const checkInspectUpdated = (prevProps, newProps) =>
  (prevProps.inspectedId !== newProps.inspectedId)
  || (prevProps.inspectedClickId !== newProps.inspectedClickId)

const circleToSlices = (circ) => {
  const slices = Object.values(circ.data.values)
    .map(value =>
      ({ value, color: circ.data.color }))

  return applyPieLayout(slices).map(slice =>
    ({ ...circ, ...slice }))
}

const tweenToMiddle = (d) => {
  const transX = d3.interpolate(d.x, MIDDLE)
  const transY = d3.interpolate(d.y, MIDDLE)
  return a => `translate(${transX(a)}, ${transY(a)})`
}

const tweenGrow = (d, i) => {
  const radius = varyRadius(d.r, i)
  const maxSliceRadius = varyRadius(DIAMETER / 2, i)
  const grow = d3.interpolate(radius, maxSliceRadius)
  return a => arc.outerRadius(grow(a)).innerRadius(0)(d)
}

const tweenShrink = (d, i) => {
  const shrinkIntrpl = d3.interpolate(varyRadius(d.r, i), 0)
  return a => arc.outerRadius(shrinkIntrpl(a)).innerRadius(0)(d)
}

const tweenToOrigPos = (d) => {
  const transX = d3.interpolate(MIDDLE, d.x)
  const transY = d3.interpolate(MIDDLE, d.y)
  return a => `translate(${transX(a)}, ${transY(a)})`
}

const appearTween = (d, i) => {
  const appear = d3.interpolate(0, varyRadius(d.r, i))
  return a => arc.outerRadius(appear(a)).innerRadius(0)(d)
}

const tweenRevertGrow = (d, i) => {
  const radius = varyRadius(d.r, i)
  const maxSliceRadius = varyRadius(DIAMETER / 2, i)
  const revertGrow = d3.interpolate(maxSliceRadius, radius)
  return a => arc.outerRadius(revertGrow(a)).innerRadius(0)(d)
}

const getTextDimension = R.memoizeWith(
  (text, className, style) => text + className + JSON.stringify(style),
  (text, className, style) => {
    const spanNode = document.createElement('span')
    const allStyles = {
      position: 'absolute',
      right: '0',
      ...style,
    }

    spanNode.innerHTML = text
    spanNode.className = className

    for (const prop in allStyles)
      spanNode.style[prop] = allStyles[prop]

    document.body.appendChild(spanNode)

    const dimensions = {
      width: spanNode.offsetWidth,
      height: spanNode.offsetHeight,
    }

    document.body.removeChild(spanNode)

    return dimensions
  },
)
