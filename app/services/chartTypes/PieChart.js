/* eslint-disable react/no-unused-prop-types */

import React from 'react'
import { withFauxDOM } from 'react-faux-dom'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import 'd3-selection-multi'
import withContainerWidth from 'app/utils/withContainerWidth'
import withStyleableContainer from 'app/utils/withStyleableContainer'
// import lighten from 'app/utils/lighten'
import { compose, lifecycle } from 'recompose'

const HEIGHT = 500
// const DURATION = 500
const BG_COLOR = '#f4f4f4'

const PieChart = ({
  chart,
  typeTitle,
}) =>
  <div>
    <h2 className='mb3 f3 tc'>{typeTitle} Pie Chart</h2>
    {chart}
  </div>

const drawChart = (inst) => {
  const {
    width,
    connectFauxDOM,
    candidates,
    drawFauxDOM,
  } = inst.props

  const height = HEIGHT
  const svg = connectFauxDOM('svg', 'chart')

  svg.setAttribute('width', '100%')
  svg.setAttribute('height', height)

  let mappedData = {
    name: 'candidates',
    children: candidates.map(({ value, ...cand }) => ({
      name: cand.id,
      values: value.map(val => val.value),
      valueTitles: value.map(val => val.title),
      ...cand,
    })),
  }

  const g = d3.select(svg).append('g')
  const rootData = d3.hierarchy(mappedData)
    .sum(d =>
      d.values
        ? d.values.reduce((sum, val) => sum + val, 0)
        : null)
    .sort((a, b) => b.value - a.value)
  const applyPackLayout = d3.pack()
    .size([width, height])
    .padding(5)

  applyPackLayout(rootData)

  const mainCircleData = rootData.ancestors()
  const circlesData = rootData.leaves()

  // Add the parent circle
  g.selectAll('circle')
    .data(mainCircleData)
    .enter()
    .append('circle')
    .style('fill', BG_COLOR)
    .attrs(d => ({
      cx: d.x,
      cy: d.y,
      r: d.r,
    }))

  // Add the pies
  const gPie = g.selectAll('g.pie')
    .data(circlesData)
    .enter()
    .append('g')
    .attr('class', '.pie')
    .on('mouseenter', d => d.data.toggleHoverInspect())
    .on('mouseleave', d => d.data.toggleHoverInspect())

  // Add the slices
  gPie.selectAll('.slice')
    .data(d => circleToSlices(d))
    .enter()
    .append('path')
    .attrs(d => ({
      class: 'slice',
      fill: d.data.color,
      stroke: BG_COLOR,
      transform: `translate(${d.x}, ${d.y})`,
      d: d3.arc()
        .outerRadius(d.r)
        .innerRadius(0),
    }))

  // Add the labels
  // gPie.append('text')
  //   .text(d => d.data.id.split('/')[1])
  //   .style('font-size', '1em')
  //   .attrs(d => ({
  //     y: d.y,
  //     x: d.x,
  //     fill: '#000',
  //     'text-anchor': 'middle',
  //   }))

  drawFauxDOM()
}

// TODO: implement or remove
const updateHighlight = (inst) => {}

// TODO: implement or remove
// const removeHighlight = () => {}

const circleToSlices = (circ) => {
  const slices = []
  const circVals = Object.values(circ.data.values)
  const baseMultiplier = -Math.floor(circVals.length / 2)

  for (const [i, value] of circVals.entries())
    slices.push({
      value,
      color: (() => {
        const c = d3.hsl(circ.data.color)

        c.l += 0.05 * (baseMultiplier + i)
        c.h += 5 * (baseMultiplier + i)

        return c.hex()
      })(),
    })

  return applyPieLayout(slices).map(slice =>
    ({ ...circ, ...slice }))
}

const applyPieLayout = d3.pie()
  .sort(null)
  .value(d => d.value)

PieChart.propTypes = {
  animateFauxDOM: PropTypes.func.isRequired,
  candidates: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    toggleClickInspect: PropTypes.func.isRequired,
    toggleHoverInspect: PropTypes.func.isRequired,
    value: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })).isRequired,
  })).isRequired,
  chart: PropTypes.node,
  connectFauxDOM: PropTypes.func.isRequired,
  drawFauxDOM: PropTypes.func.isRequired,
  inspectedCandidateId: PropTypes.string,
  typeTitle: PropTypes.string.isRequired,
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
)(PieChart)
