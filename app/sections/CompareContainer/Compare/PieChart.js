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
      values: value,
      ...cand,
    })),
  }

  const g = d3.select(svg).append('g')
  const rootData = d3.hierarchy(mappedData)
    .sum(d =>
      d.values
        ? Object.entries(d.values).reduce((sum, [_, val]) => sum + val, 0)
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
    .style('fill', '#f4f4f4')
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

  // Add the slices
  gPie.selectAll('.slice')
    .data(d => circleToSlices(d))
    .enter()
    .append('path')
    .attrs(d => ({
      class: 'slice',
      fill: d.data.color,
      stroke: '#f4f4f4',
      transform: `translate(${d.x}, ${d.y})`,
      d: d3.arc()
        .outerRadius(d.r)
        .innerRadius(0),
    }))

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

const PieChart = ({
  chart,
  dataKeyName,
}) =>
  <div>
    <h2 className='mb3 f3 tc'>{dataKeyName} Pie Chart</h2>
    {chart}
  </div>

PieChart.propTypes = {
  animateFauxDOM: PropTypes.func.isRequired,
  candidates: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    toggleClickInspect: PropTypes.func.isRequired,
    toggleHoverInspect: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
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
)(PieChart)
