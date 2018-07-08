/* eslint-disable react/no-unused-prop-types */

import React from 'react'
import { withFauxDOM } from 'react-faux-dom'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import 'd3-selection-multi'
import withContainerWidth from 'app/utils/withContainerWidth'
import withStyleableContainer from 'app/utils/withStyleableContainer'
import lighten from 'app/utils/lighten'
import { compose, lifecycle } from 'recompose'

const HEIGHT = 500
const DURATION = 500

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
    }))
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

  const ancestorData = rootData.ancestors()
  const leavesData = rootData.leaves()

  g.selectAll('circle')
    .data(ancestorData)
    .enter()
    .append('circle')
    .style('fill', '#333')
    .attrs(d => ({
      cx: d.x,
      cy: d.y,
      r: d.r,
    }))

  leavesData.forEach(leafDatum => {
    const valuesQty = Object.keys(leafDatum.data.values).length
    const applyPieLayout = d3.pie()
      .sort(null)
      .value(d => d.value)
    const path = d3.arc()
      .outerRadius(leafDatum.r)
      .innerRadius(0)

    // const label = d3.arc()
    //   .outerRadius(radius - 40)
    //   .innerRadius(radius - 40)

    const colors = (() => {
      let multiplier = -Math.floor(valuesQty / 2)
      const theColors = []

      while (theColors.length !== valuesQty) {
        const c = d3.hsl(leafDatum.data.color)
        c.l += .05 * multiplier
        c.h += 5 * multiplier
        theColors.push(c.hex())
        multiplier++
      }

      return theColors
    })()

    const mappedValues = Object.values(leafDatum.data.values)
      .reduce((a, v, i) =>
        [...a, {
          value: v,
          color: colors[i],
        }],
      [])

    g.append('g')
      .selectAll('.slice')
      .data(applyPieLayout(mappedValues))
      .enter()
      .append('path')
      .attrs(d => ({
        class: 'slice',
        d: path,
        fill: d.data.color,
        stroke: '#fff',
        transform: `translate(${leafDatum.x}, ${leafDatum.y})`,
      }))

    // pie.append('text')
    //   .attr('transform', function(d) { return 'translate(' + label.centroid(d) + ')' })
    //   .attr('dy', '0.35em')
    //   .text(function(d) { return d.data.age })
  })

  drawFauxDOM()
}

// TODO: implement or remove
const updateHighlight = (inst) => {}

// TODO: implement or remove
const removeHighlight = () => {}

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
