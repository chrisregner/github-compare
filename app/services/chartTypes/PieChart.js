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
const TEXT_COLOR = '#333'
const BG_COLOR = '#fff'
const DURATION = 750
const MIDDLE = DIAMETER / 2
const FONT_SM = '.75rem'
const centerTextAttrs = {
  'alignment-baseline': 'middle',
  'text-anchor': 'middle',
}

const PieChart = ({
  setSvgRef,
  typeTitle,
}) =>
  <div>
    <h2 className='mb4 f3'>{typeTitle} Pie Chart</h2>
    <svg className='b' ref={setSvgRef} />
  </div>

const enhance = compose(
  withStyleableContainer,
  withContainerWidth,
  withState('svgRef', 'setSvgRef', null),

  lifecycle({
    componentDidUpdate: function (prevProps) {
      // Initial render
      if (!this.hasRendered) {
        drawChart(this)
        this.hasRendered = true

      // Chart rewrite (candidates has changed)
      } else if (prevProps.candidates !== this.props.candidates) {
        drawChart(this)

      // Update inspected (candidate has been hovered/clicked)
      } else if (checkInspectUpdated(prevProps, this.props) && !this.t) {
        updateInspected(this)
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
  svgRef: PropTypes.object,
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

  svgRef.innerHTML = '' // Remove any previous chart
  svgRef.setAttribute('width', '100%')
  svgRef.setAttribute('height', GROSS_DIAMETER)

  const svg = d3.select(svgRef)
  let mappedData = {
    name: 'candidates',
    children: candidates.map(({ value, ...cand }) => ({
      name: cand.name,
      rawValue: value,
      value: value.map(x => x.value).reduce(R.add),
      valueTitles: value.map(val => val.title),
      ...cand,
    })),
  }

  // Interrupt any ongoing transition
  // (usually an unfinished transition from pie chart of another data)
  svg.interrupt()

  // Add wrapper; translate to take account for padding
  const wrapper = d3.select(svgRef)
    .append('g')
    .attrs({
      class: 'wrapper',
      transform: `translate(${PADDING}, ${PADDING})`,
    })

  // Save transition instance
  const t = svg.transition()
    .duration(DURATION)
    .on('end', () => updateInspected(inst, DURATION / 4))

  inst.t = t

  // Apply hierarchy to data
  const rootData = d3.hierarchy(mappedData)
    .sum(d => d.value)
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
    .attrs({ class: 'pie', cursor: 'pointer' })
    .on('click', d => !inst.t && d.data.toggleClickInspect())
    .on('mouseenter', d => !inst.t && d.data.toggleHoverInspect())
    .on('mouseleave', d => !inst.t && d.data.unhoverInspect())

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
    .attrTween('d', tweenAppear)

  // Add the issues count
  const info = pies.append('g')
    .attrs({
      class: 'info',
      opacity: 0,
    })
  info.append('text')
    .style('text-transform', 'uppercase')
    .attrs(({ x, y }) => ({
      x, y,
      ...centerTextAttrs,
      'font-size': FONT_SM,
      'paint-order': 'stroke',
      'stroke-width': 2,
      fill: TEXT_COLOR,
      stroke: BG_COLOR,
    }))
    .text(d => d.value)
  info.transition(t)
    .attr('opacity', 1)

  // Add the (hidden) show button
  const showBtn = pies.append('g')
    .attrs({
      class: 'show-btn',
      visibility: 'hidden',
    })
  showBtn.append('text')
    .style('text-transform', 'uppercase')
    .attrs(({ x, y }) => ({
      x, y,
      ...centerTextAttrs,
      'font-size': FONT_SM,
      'paint-order': 'stroke',
      'stroke-width': 2,
      fill: TEXT_COLOR,
      stroke: BG_COLOR,
    }))
    .text('Show Details')
}

const updateInspected = (inst, delay = 0) => {
  const {
    inspectedClickId,
    inspectedId,
    svgRef,
  } = inst.props

  const svg = d3.select(svgRef)
  const pies = svg.selectAll('.pie')
  const hasPreviouslyClicked = svg.selectAll('.pie.clicked').size()

  // Create transition instance
  const t = svg.transition()
    .delay(delay)
    .duration(DURATION)
    .on('end', () => {
      // NOTE: if there is no clicked candidate,
      // transition will be deleted after the mail labels appears
      if (!inspectedClickId)
        inst.t = null
    })

  // Flag if transitioning (to block other update until it finishes)
  if (
    (inspectedClickId && !svg.select('.clicked').size())
    || (!inspectedClickId && svg.select('.clicked').size())
  )
    inst.t = t

  // Raise the inspected
  pies.filter(d => d.data.id === inspectedId)
    .raise()

  // Show Button (visible when hover inspected and NONE is clicked)
  pies.select('.show-btn')
    .attr('visibility', d =>
      !inspectedClickId && (d.data.id === inspectedId) ? 'visible' : 'hidden')

  // Info Button
  const info = pies.select('.info')
  if (inspectedClickId) {
    // Immediately hide the clicked
    info.filter(d => d.data.id === inspectedClickId)
      .transition(t)
      .duration(0)
      .attrs({
        opacity: 0,
        visibility: 'none',
      })

    // Fade out those that aren't clicked
    info.filter(d => d.data.id !== inspectedClickId)
      .transition(t)
      .attr('opacity', 0)
      .on('end', function () {
        d3.select(this).attr('visibility', 'hidden')
      })
  } else if (hasPreviouslyClicked) {
    info.transition(t)
      .attrs({
        opacity: 1,
        visibility: 'visible',
      })
  } else {
    info.attrs(d => ({
      opacity: 1,
      visibility: d.data.id === inspectedId ? 'hidden' : 'visible',
    }))
  }

  if (inspectedClickId) {
    let totalPct = 0
    const clickedPies = pies.filter(d => d.data.id === inspectedClickId)
    const clickedSlices = clickedPies.selectAll('.slice')
    const details = clickedPies.append('g').attrs({ class: 'details', opacity: 1 })
    const centerLabelAttrs
      = {
        ...centerTextAttrs,
        'font-size': FONT_SM,
        class: 'center-label ttu',
        fill: TEXT_COLOR,
        opacity: 0,
        x: MIDDLE,
        y: MIDDLE,
      }
    const total = clickedSlices.data()
      .map(d => d.value)
      .reduce(R.add)
    const slicesData = clickedSlices.data()
      .filter(d => d.value > 0)
      .map((d) => {
        const pct = d.value / total
        totalPct += pct
        const labelPosPct = (((1 - pct) / 2) + totalPct) % 1
        const shouldReverse = labelPosPct <= 0.25 || labelPosPct >= 0.75
        return { ...d, labelPosPct, shouldReverse }
      })

    // Grow and move clicked pies to middle
    clickedSlices
      .transition(t)
      .attrTween('transform', tweenToMiddle)
      .attrTween('d', tweenGrow)

    // Add the center labels
    details.append('text')
      .text(inst.props.typeTitle)
      .attrs({ ...centerLabelAttrs, dy: '-6%' })
    details.append('text')
      .text(d => d.data.name)
      .attrs({ ...centerLabelAttrs, dy: '-2%' })
    details.append('text')
      .text(d => d.value + ' Total')
      .attrs({ ...centerLabelAttrs, dy: '2%' })
    details.append('text')
      .text('(Click to hide)')
      .attrs({
        ...centerLabelAttrs,
        dy: '6%',
        fill: 'gray',
        'font-size': '.625rem',
      })

    // Add the slice label arc
    details.selectAll('.slice-label-arc')
      .data(slicesData)
      .enter()
      .append('path')
      .attrs((d, i) => {
        const maxSliceRadius = varyRadius(DIAMETER / 2, i)
        let arcD = d3.arc()
          .innerRadius(0)
          .outerRadius(maxSliceRadius)
          .startAngle(0)
          .endAngle(Math.PI * 2)()

        if (d.shouldReverse) {
          const commands = /M(.*?)A(.*?)A(.*?)Z/
          const [_, move, arcA, arcB] = commands.exec(arcD) // eslint-disable-line no-unused-vars
          const arcAReversed = arcA.split(',').map((v, i) => i === 4 ? '0' : v)
          const arcBReversed = arcB.split(',').map((v, i) => i === 4 ? '0' : v)
          arcD = `M${move}A${arcAReversed.join(',')}A${arcBReversed.join(',')}Z`
        }

        return {
          id: 'slice-label-arc-' + i,
          class: 'slice-label-arc',
          transform: `translate(${MIDDLE}, ${MIDDLE})
            rotate(${(d.labelPosPct * 360)})`,
          d: arcD,
          visibility: 'hidden',
        }
      })

    // Add the slice label text
    details.selectAll('.slice-label')
      .data(slicesData)
      .enter()
      .append('text')
      .attrs(d => ({
        class: 'slice-label ttu',
        dy: DIAMETER * (d.shouldReverse ? 0.015 : -0.015),
        opacity: 0,
      }))
      .append('textPath')
        .attrs((d, i) => ({
          'alignment-baseline': d.shouldReverse ? 'hanging' : 'baseline',
          'font-size': FONT_SM,
          'paint-order': 'stroke',
          'stroke-width': 2,
          'text-anchor': 'middle',
          'xlink:href': '#slice-label-arc-' + i,
          fill: TEXT_COLOR,
          startOffset: '50%',
          stroke: BG_COLOR,
        }))
        .text((d) => {
          const pct = Math.round(d.data.value / total * 1000) / 10
          return `${d.data.value} ${d.data.name} (${pct}%)`
        })

    // Animate the details
    details.selectAll('.center-label')
      .transition()
      .duration(DURATION / 2)
      .delay(DURATION)
      .attr('opacity', 1)

    details.selectAll('.slice-label')
      .transition()
      .duration(DURATION / 2)
      .delay((d, i) => (DURATION / 2) * (i + 3))
      .attr('opacity', 1)
      .on('end', (d, i) => {
        // Flag that the transition has ended to stop blocking updates
        if (i === slicesData.length - 1)
          inst.t = null
      })
  }

  // Banish nonclicked pies
  if (inspectedClickId)
    pies.filter(d => d.data.id !== inspectedId)
      .selectAll('.slice')
      .transition(t)
      .attrTween('d', tweenDisappear)

  // When unclicked, revert size and position of unclicked pies
  svg.selectAll('.pie.clicked')
    .filter(d => d.id !== inspectedClickId).selectAll('.slice')
    .transition(t)
    .attrTween('transform', tweenToOrigPos)
    .attrTween('d', tweenRevertGrow)

  // When unclicked, show non clicked pies
  if (hasPreviouslyClicked)
    svg.selectAll('.pie:not(.clicked)')
      .filter(d => d.data.id !== inspectedId)
      .selectAll('.slice')
      .transition(t)
      .attrTween('d', tweenAppear)

  // Banish details
  if (hasPreviouslyClicked && !inspectedClickId)
    svg.selectAll('.details')
      .transition(t)
      .duration(DURATION / 2)
      .attr('opacity', 0)
      .on('end', () => {
        svg.selectAll('.details').remove()
      })

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
  const slices = circ.data.rawValue.map(({ value, title }) =>
    ({
      value,
      name: title,
      color: circ.data.color,
    }))

  return applyPieLayout(slices).map(slice =>
    ({ ...circ, ...slice }))
}
const tweenAppear = (d, i) => {
  const appear = d3.interpolate(0, varyRadius(d.r, i))
  return a => arc.outerRadius(appear(a)).innerRadius(0)(d)
}

const tweenDisappear = (d, i) => {
  const shrinkIntrpl = d3.interpolate(varyRadius(d.r, i), 0)
  return a => arc.outerRadius(shrinkIntrpl(a)).innerRadius(0)(d)
}

const tweenGrow = (d, i) => {
  const radius = varyRadius(d.r, i)
  const maxSliceRadius = varyRadius(DIAMETER / 2, i)
  const growInner = d3.interpolate(radius, maxSliceRadius)
  const growOuter = d3.interpolate(0, DIAMETER / 4)
  return a => arc.outerRadius(growInner(a)).innerRadius(growOuter(a))(d)
}

const tweenRevertGrow = (d, i) => {
  const radius = varyRadius(d.r, i)
  const maxSliceRadius = varyRadius(DIAMETER / 2, i)
  const revertInner = d3.interpolate(maxSliceRadius, radius)
  const revertOuter = d3.interpolate(DIAMETER / 4, 0)
  return a => arc.outerRadius(revertInner(a)).innerRadius(revertOuter(a))(d)
}

const tweenToMiddle = (d) => {
  const transX = d3.interpolate(d.x, MIDDLE)
  const transY = d3.interpolate(d.y, MIDDLE)
  return a => `translate(${transX(a)}, ${transY(a)})`
}

const tweenToOrigPos = (d) => {
  const transX = d3.interpolate(MIDDLE, d.x)
  const transY = d3.interpolate(MIDDLE, d.y)
  return a => `translate(${transX(a)}, ${transY(a)})`
}

// const getTextDimension = R.memoizeWith(
//   (text, className, style) => text + className + JSON.stringify(style),
//   (text, className, style) => {
//     const spanNode = document.createElement('span')
//     const allStyles = {
//       position: 'absolute',
//       right: '0',
//       ...style,
//     }

//     spanNode.innerHTML = text
//     spanNode.className = className

//     for (const prop in allStyles)
//       spanNode.style[prop] = allStyles[prop]

//     document.body.appendChild(spanNode)

//     const dimensions = {
//       width: spanNode.offsetWidth,
//       height: spanNode.offsetHeight,
//     }

//     document.body.removeChild(spanNode)

//     return dimensions
//   },
// )
